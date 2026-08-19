Absolutely. The right architecture is **not** to write a giant class that hard-codes every AnkiConnect action. AnkiConnect is essentially an RPC API, and the API evolves; the best design is:

1. A robust low-level `invoke()` transport layer.
2. High-level typed/convenient methods for the operations you use frequently.
3. A `raw()` escape hatch that exposes **every AnkiConnect action**, including newly added ones, without needing to update your service.

That gives you both ergonomics and complete API coverage.

The current AnkiConnect API is exposed over HTTP on `127.0.0.1:8765`, uses API version `6`, returns `{ result, error }`, and supports categories spanning cards, notes, decks, models, media, GUI, statistics, and miscellaneous collection operations. ([GitHub][1])

## `AnkiService.js`

This is the version I'd actually use in a Node.js project:

```js
// services/AnkiService.js

const DEFAULT_URL = "http://127.0.0.1:8765";
const DEFAULT_API_VERSION = 6;

export class AnkiConnectError extends Error {
  constructor(message, { action, params, cause } = {}) {
    super(message, { cause });
    this.name = "AnkiConnectError";
    this.action = action;
    this.params = params;
  }
}

export class AnkiConnectionError extends Error {
  constructor(message, { cause } = {}) {
    super(message, { cause });
    this.name = "AnkiConnectionError";
  }
}

export class AnkiService {
  #url;
  #apiKey;
  #version;
  #timeout;
  #retries;
  #retryDelay;

  constructor({
    url = process.env.ANKI_CONNECT_URL ?? DEFAULT_URL,
    apiKey = process.env.ANKI_CONNECT_API_KEY,
    version = DEFAULT_API_VERSION,
    timeout = 10_000,
    retries = 2,
    retryDelay = 300,
  } = {}) {
    this.#url = url.replace(/\/+$/, "");
    this.#apiKey = apiKey;
    this.#version = version;
    this.#timeout = timeout;
    this.#retries = retries;
    this.#retryDelay = retryDelay;
  }

  // ---------------------------------------------------------------------------
  // Core RPC layer
  // ---------------------------------------------------------------------------

  async invoke(action, params = {}) {
    if (!action || typeof action !== "string") {
      throw new TypeError("AnkiConnect action must be a non-empty string.");
    }

    let lastError;

    for (let attempt = 0; attempt <= this.#retries; attempt++) {
      try {
        return await this.#request(action, params);
      } catch (error) {
        lastError = error;

        // Never retry logical AnkiConnect errors.
        // Retry only connection / HTTP-level failures.
        if (
          error instanceof AnkiConnectError ||
          attempt >= this.#retries
        ) {
          throw error;
        }

        await this.#sleep(this.#retryDelay * 2 ** attempt);
      }
    }

    throw lastError;
  }

  async #request(action, params) {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      this.#timeout,
    );

    const body = {
      action,
      version: this.#version,
      params,
    };

    if (this.#apiKey) {
      body.key = this.#apiKey;
    }

    try {
      const response = await fetch(this.#url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AnkiConnectionError(
          `AnkiConnect returned HTTP ${response.status} ${response.statusText}`,
        );
      }

      let payload;

      try {
        payload = await response.json();
      } catch (cause) {
        throw new AnkiConnectionError(
          "AnkiConnect returned invalid JSON.",
          { cause },
        );
      }

      if (!Object.prototype.hasOwnProperty.call(payload, "result")) {
        throw new AnkiConnectionError(
          "AnkiConnect response is missing `result`.",
        );
      }

      if (!Object.prototype.hasOwnProperty.call(payload, "error")) {
        throw new AnkiConnectionError(
          "AnkiConnect response is missing `error`.",
        );
      }

      if (payload.error !== null) {
        throw new AnkiConnectError(
          String(payload.error),
          {
            action,
            params,
          },
        );
      }

      return payload.result;
    } catch (error) {
      if (error instanceof AnkiConnectError) {
        throw error;
      }

      if (error instanceof AnkiConnectionError) {
        throw error;
      }

      if (error.name === "AbortError") {
        throw new AnkiConnectionError(
          `AnkiConnect request timed out after ${this.#timeout}ms.`,
          { cause: error },
        );
      }

      throw new AnkiConnectionError(
        `Could not connect to AnkiConnect at ${this.#url}. Is Anki running?`,
        { cause: error },
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Escape hatch:
   *
   * service.raw("someFutureAction", {...})
   *
   * This means your service automatically supports new AnkiConnect
   * actions without needing a class update.
   */
  raw(action, params = {}) {
    return this.invoke(action, params);
  }

  /**
   * Execute multiple AnkiConnect actions in one request.
   *
   * Supported by AnkiConnect's `multi` action.
   */
  multi(actions) {
    return this.invoke("multi", {
      actions,
    });
  }

  // ---------------------------------------------------------------------------
  // Connection / API
  // ---------------------------------------------------------------------------

  requestPermission() {
    return this.invoke("requestPermission");
  }

  version() {
    return this.invoke("version");
  }

  apiReflect() {
    return this.invoke("apiReflect");
  }

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  findCards(query) {
    return this.invoke("findCards", { query });
  }

  findNotes(query) {
    return this.invoke("findNotes", { query });
  }

  async searchCards(query) {
    const cardIds = await this.findCards(query);

    if (cardIds.length === 0) {
      return [];
    }

    return this.cardsInfo(cardIds);
  }

  async searchNotes(query) {
    const noteIds = await this.findNotes(query);

    if (noteIds.length === 0) {
      return [];
    }

    return this.notesInfo(noteIds);
  }

  async findCard(query) {
    const cards = await this.searchCards(query);

    return cards[0] ?? null;
  }

  async findNote(query) {
    const notes = await this.searchNotes(query);

    return notes[0] ?? null;
  }

  // ---------------------------------------------------------------------------
  // Cards
  // ---------------------------------------------------------------------------

  cardsInfo(cards) {
    return this.invoke("cardsInfo", { cards });
  }

  cardsModTime(cards) {
    return this.invoke("cardsModTime", { cards });
  }

  cardsToNotes(cards) {
    return this.invoke("cardsToNotes", { cards });
  }

  getEaseFactors(cards) {
    return this.invoke("getEaseFactors", { cards });
  }

  setEaseFactors(cards, easeFactors) {
    if (cards.length !== easeFactors.length) {
      throw new Error(
        "`cards` and `easeFactors` must contain the same number of items.",
      );
    }

    return this.invoke("setEaseFactors", {
      cards,
      easeFactors,
    });
  }

  setSpecificValueOfCard({
    card,
    keys,
    newValues,
    warningCheck = false,
  }) {
    return this.invoke("setSpecificValueOfCard", {
      card,
      keys,
      newValues,
      warning_check: warningCheck,
    });
  }

  suspend(cards) {
    return this.invoke("suspend", { cards });
  }

  unsuspend(cards) {
    return this.invoke("unsuspend", { cards });
  }

  suspended(card) {
    return this.invoke("suspended", { card });
  }

  areSuspended(cards) {
    return this.invoke("areSuspended", { cards });
  }

  areDue(cards) {
    return this.invoke("areDue", { cards });
  }

  getIntervals(cards, complete = false) {
    return this.invoke("getIntervals", {
      cards,
      complete,
    });
  }

  forgetCards(cards) {
    return this.invoke("forgetCards", { cards });
  }

  relearnCards(cards) {
    return this.invoke("relearnCards", { cards });
  }

  answerCards(cards) {
    return this.invoke("answerCards", { cards });
  }

  setDueDate(cards, days) {
    return this.invoke("setDueDate", {
      cards,
      days,
    });
  }

  changeDeck(cards, deck) {
    return this.invoke("changeDeck", {
      cards,
      deck,
    });
  }

  // ---------------------------------------------------------------------------
  // Notes
  // ---------------------------------------------------------------------------

  addNote(note) {
    return this.invoke("addNote", { note });
  }

  addNotes(notes) {
    return this.invoke("addNotes", { notes });
  }

  canAddNote(note) {
    return this.invoke("canAddNote", { note });
  }

  canAddNotes(notes) {
    return this.invoke("canAddNotes", { notes });
  }

  canAddNotesWithErrorDetail(notes) {
    return this.invoke("canAddNotesWithErrorDetail", {
      notes,
    });
  }

  notesInfo(notes) {
    return this.invoke("notesInfo", { notes });
  }

  notesModTime(notes) {
    return this.invoke("notesModTime", { notes });
  }

  updateNote(note) {
    return this.invoke("updateNote", { note });
  }

  updateNoteFields(noteId, fields) {
    return this.invoke("updateNoteFields", {
      note: {
        id: noteId,
        fields,
      },
    });
  }

  updateNoteTags(noteId, tags) {
    return this.invoke("updateNoteTags", {
      note: {
        id: noteId,
        tags,
      },
    });
  }

  deleteNotes(notes) {
    return this.invoke("deleteNotes", { notes });
  }

  removeEmptyNotes() {
    return this.invoke("removeEmptyNotes");
  }

  // ---------------------------------------------------------------------------
  // Tags
  // ---------------------------------------------------------------------------

  addTags(notes, tags) {
    return this.invoke("addTags", {
      notes,
      tags,
    });
  }

  removeTags(notes, tags) {
    return this.invoke("removeTags", {
      notes,
      tags,
    });
  }

  replaceTags(notes, tagToReplace, replaceWithTag) {
    return this.invoke("replaceTags", {
      notes,
      tag_to_replace: tagToReplace,
      replace_with_tag: replaceWithTag,
    });
  }

  replaceTagsInAllNotes(tagToReplace, replaceWithTag) {
    return this.invoke("replaceTagsInAllNotes", {
      tag_to_replace: tagToReplace,
      replace_with_tag: replaceWithTag,
    });
  }

  getTags() {
    return this.invoke("getTags");
  }

  clearUnusedTags() {
    return this.invoke("clearUnusedTags");
  }

  // ---------------------------------------------------------------------------
  // Decks
  // ---------------------------------------------------------------------------

  deckNames() {
    return this.invoke("deckNames");
  }

  deckNamesAndIds() {
    return this.invoke("deckNamesAndIds");
  }

  getDecks(cards) {
    return this.invoke("getDecks", { cards });
  }

  createDeck(deck) {
    return this.invoke("createDeck", { deck });
  }

  deleteDecks(decks, cardsToo = false) {
    return this.invoke("deleteDecks", {
      decks,
      cardsToo,
    });
  }

  getDeckConfig(deck) {
    return this.invoke("getDeckConfig", { deck });
  }

  saveDeckConfig(config) {
    return this.invoke("saveDeckConfig", { config });
  }

  setDeckConfigId(deck, configId) {
    return this.invoke("setDeckConfigId", {
      deck,
      configId,
    });
  }

  cloneDeckConfigId(name, cloneFrom) {
    return this.invoke("cloneDeckConfigId", {
      name,
      cloneFrom,
    });
  }

  removeDeckConfigId(configId) {
    return this.invoke("removeDeckConfigId", {
      configId,
    });
  }

  getDeckStats(decks) {
    return this.invoke("getDeckStats", { decks });
  }

  // ---------------------------------------------------------------------------
  // Models / Note Types
  // ---------------------------------------------------------------------------

  modelNames() {
    return this.invoke("modelNames");
  }

  modelNamesAndIds() {
    return this.invoke("modelNamesAndIds");
  }

  modelFieldNames(modelName) {
    return this.invoke("modelFieldNames", {
      modelName,
    });
  }

  modelFieldDescriptions(modelName) {
    return this.invoke("modelFieldDescriptions", {
      modelName,
    });
  }

  modelStyling(modelName) {
    return this.invoke("modelStyling", {
      modelName,
    });
  }

  modelTemplates(modelName) {
    return this.invoke("modelTemplates", {
      modelName,
    });
  }

  modelFieldsOnTemplates(modelName) {
    return this.invoke("modelFieldsOnTemplates", {
      modelName,
    });
  }

  modelNamesAndIds() {
    return this.invoke("modelNamesAndIds");
  }

  findModelsById(modelIds) {
    return this.invoke("findModelsById", {
      modelIds,
    });
  }

  findModelsByName(modelNames) {
    return this.invoke("findModelsByName", {
      modelNames,
    });
  }

  modelNameFromId(modelId) {
    return this.invoke("modelNameFromId", {
      modelId,
    });
  }

  createModel(model) {
    return this.invoke("createModel", model);
  }

  updateModelTemplates(modelName, templates) {
    return this.invoke("updateModelTemplates", {
      modelName,
      templates,
    });
  }

  updateModelStyling(modelName, css) {
    return this.invoke("updateModelStyling", {
      modelName,
      css,
    });
  }

  findAndReplaceInModels({
    modelName,
    find,
    replace,
    field = null,
    template = null,
    css = false,
  }) {
    return this.invoke("findAndReplaceInModels", {
      modelName,
      find,
      replace,
      field,
      template,
      css,
    });
  }

  modelTemplateRename(modelName, oldTemplateName, newTemplateName) {
    return this.invoke("modelTemplateRename", {
      modelName,
      oldTemplateName,
      newTemplateName,
    });
  }

  modelTemplateReposition(modelName, templateName, index) {
    return this.invoke("modelTemplateReposition", {
      modelName,
      templateName,
      index,
    });
  }

  modelTemplateAdd(modelName, template) {
    return this.invoke("modelTemplateAdd", {
      modelName,
      template,
    });
  }

  modelTemplateRemove(modelName, templateName) {
    return this.invoke("modelTemplateRemove", {
      modelName,
      templateName,
    });
  }

  modelFieldRename(modelName, oldFieldName, newFieldName) {
    return this.invoke("modelFieldRename", {
      modelName,
      oldFieldName,
      newFieldName,
    });
  }

  modelFieldReposition(modelName, fieldName, index) {
    return this.invoke("modelFieldReposition", {
      modelName,
      fieldName,
      index,
    });
  }

  modelFieldAdd(modelName, fieldName, index) {
    return this.invoke("modelFieldAdd", {
      modelName,
      fieldName,
      index,
    });
  }

  modelFieldRemove(modelName, fieldName) {
    return this.invoke("modelFieldRemove", {
      modelName,
      fieldName,
    });
  }

  modelFieldSetFont(modelName, fieldName, font) {
    return this.invoke("modelFieldSetFont", {
      modelName,
      fieldName,
      font,
    });
  }

  modelFieldSetFontSize(modelName, fieldName, size) {
    return this.invoke("modelFieldSetFontSize", {
      modelName,
      fieldName,
      size,
    });
  }

  modelFieldSetDescription(modelName, fieldName, description) {
    return this.invoke("modelFieldSetDescription", {
      modelName,
      fieldName,
      description,
    });
  }

  // ---------------------------------------------------------------------------
  // Media
  // ---------------------------------------------------------------------------

  storeMediaFile({
    filename,
    data,
    path,
    url,
    skipHash = false,
    deleteExisting = false,
  }) {
    return this.invoke("storeMediaFile", {
      filename,
      ...(data !== undefined && { data }),
      ...(path !== undefined && { path }),
      ...(url !== undefined && { url }),
      skipHash,
      deleteExisting,
    });
  }

  retrieveMediaFile(filename) {
    return this.invoke("retrieveMediaFile", {
      filename,
    });
  }

  getMediaFilesNames(pattern = "*") {
    return this.invoke("getMediaFilesNames", {
      pattern,
    });
  }

  getMediaDirPath() {
    return this.invoke("getMediaDirPath");
  }

  deleteMediaFile(filename) {
    return this.invoke("deleteMediaFile", {
      filename,
    });
  }

  // ---------------------------------------------------------------------------
  // GUI
  // ---------------------------------------------------------------------------

  guiBrowse(query) {
    return this.invoke("guiBrowse", { query });
  }

  guiSelectCard(card) {
    return this.invoke("guiSelectCard", { card });
  }

  guiSelectedNotes() {
    return this.invoke("guiSelectedNotes");
  }

  guiAddCards(options = {}) {
    return this.invoke("guiAddCards", options);
  }

  guiAddNote(note) {
    return this.invoke("guiAddNote", { note });
  }

  guiCurrentCard() {
    return this.invoke("guiCurrentCard");
  }

  guiCheckDatabase() {
    return this.invoke("guiCheckDatabase");
  }

  guiDeckOverview(name) {
    return this.invoke("guiDeckOverview", { name });
  }

  guiDeckBrowser() {
    return this.invoke("guiDeckBrowser");
  }

  guiDeckReview(name) {
    return this.invoke("guiDeckReview", { name });
  }

  guiReviewActive() {
    return this.invoke("guiReviewActive");
  }

  guiShowQuestion() {
    return this.invoke("guiShowQuestion");
  }

  guiShowAnswer() {
    return this.invoke("guiShowAnswer");
  }

  guiAnswerCard(ease) {
    return this.invoke("guiAnswerCard", { ease });
  }

  guiUndo() {
    return this.invoke("guiUndo");
  }

  guiStartCardTimer() {
    return this.invoke("guiStartCardTimer");
  }

  guiPlayAudio() {
    return this.invoke("guiPlayAudio");
  }

  guiEditNote(note) {
    return this.invoke("guiEditNote", { note });
  }

  guiImportFile(path) {
    return this.invoke("guiImportFile", { path });
  }

  guiExitAnki() {
    return this.invoke("guiExitAnki");
  }

  // ---------------------------------------------------------------------------
  // Collection / Misc
  // ---------------------------------------------------------------------------

  sync() {
    return this.invoke("sync");
  }

  reloadCollection() {
    return this.invoke("reloadCollection");
  }

  getProfiles() {
    return this.invoke("getProfiles");
  }

  getActiveProfile() {
    return this.invoke("getActiveProfile");
  }

  loadProfile(name) {
    return this.invoke("loadProfile", {
      name,
    });
  }

  exportPackage({
    deck,
    path,
    includeSchedule = true,
    includeMedia = true,
  }) {
    return this.invoke("exportPackage", {
      deck,
      path,
      includeSchedule,
      includeMedia,
    });
  }

  importPackage(path) {
    return this.invoke("importPackage", {
      path,
    });
  }

  // ---------------------------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------------------------

  getNumCardsReviewedToday() {
    return this.invoke("getNumCardsReviewedToday");
  }

  getNumCardsReviewedByDay(days) {
    return this.invoke("getNumCardsReviewedByDay", {
      days,
    });
  }

  getCollectionStatsHTML(maxRetained = -1) {
    return this.invoke("getCollectionStatsHTML", {
      maxRetained,
    });
  }

  getLatestReviewId() {
    return this.invoke("getLatestReviewId");
  }

  cardReviews({
    cards,
    startID,
    endID,
  }) {
    return this.invoke("cardReviews", {
      cards,
      ...(startID !== undefined && { startID }),
      ...(endID !== undefined && { endID }),
    });
  }

  getReviewsOfCards(cards) {
    return this.invoke("getReviewsOfCards", {
      cards,
    });
  }

  insertReviews(reviews) {
    return this.invoke("insertReviews", {
      reviews,
    });
  }

  // ---------------------------------------------------------------------------
  // Convenience workflows
  // ---------------------------------------------------------------------------

  /**
   * Find a note, then update only selected fields.
   *
   * Example:
   * await anki.updateNoteByQuery(
   *   'deck:"EnglishMastery" "twisted"',
   *   { Back: "..." }
   * );
   */
  async updateNoteByQuery(query, fields) {
    const note = await this.findNote(query);

    if (!note) {
      return null;
    }

    await this.updateNoteFields(note.noteId, fields);

    return this.notesInfo([note.noteId]).then(
      ([updated]) => updated,
    );
  }

  /**
   * Find all notes matching a query and update a field on all of them.
   */
  async bulkUpdateNotes(query, fields) {
    const notes = await this.searchNotes(query);

    if (notes.length === 0) {
      return {
        updated: 0,
        noteIds: [],
      };
    }

    const noteIds = notes.map((note) => note.noteId);

    await this.updateNoteFieldsForMany(noteIds, fields);

    return {
      updated: noteIds.length,
      noteIds,
    };
  }

  async updateNoteFieldsForMany(noteIds, fields) {
    return this.multi(
      noteIds.map((id) => ({
        action: "updateNoteFields",
        version: this.#version,
        params: {
          note: {
            id,
            fields,
          },
        },
      })),
    );
  }

  /**
   * Search notes and return only the field values.
   */
  async getFieldValues(query, fieldName) {
    const notes = await this.searchNotes(query);

    return notes.map((note) => ({
      noteId: note.noteId,
      value: note.fields?.[fieldName]?.value ?? null,
    }));
  }

  /**
   * Find cards and group them by note.
   */
  async getCardsGroupedByNote(query) {
    const cards = await this.searchCards(query);

    const groups = new Map();

    for (const card of cards) {
      const noteId = card.note;

      if (!groups.has(noteId)) {
        groups.set(noteId, []);
      }

      groups.get(noteId).push(card);
    }

    return groups;
  }

  static #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  #sleep(ms) {
    return AnkiService.#sleep(ms);
  }
}
```

There are a couple of important reasons I designed it this way.

### 1. `raw()` means you really have the whole API

For example, suppose a new AnkiConnect version adds:

```text
someAwesomeNewAction
```

You don't need to modify your service:

```js
await anki.raw("someAwesomeNewAction", {
  something: "hello",
});
```

That's the key architectural decision.

AnkiConnect itself explicitly exposes an RPC-style `action + version + params` interface and maintains deprecated actions for compatibility, so this abstraction fits the API very naturally. ([GitHub][1])

---

# The interesting part: search → inspect → modify

For your original requirement, you can now do:

```js
const anki = new AnkiService();

const cards = await anki.searchCards(
  'deck:"EnglishMastery" front:"twisted"',
);

console.dir(cards, { depth: null });
```

That internally performs:

```text
findCards()
       ↓
card IDs
       ↓
cardsInfo()
       ↓
complete card objects
```

`findCards` is specifically intended for searching cards without opening the GUI, while `cardsInfo` returns the card's fields, front/back, note type, note ID, deck, modification time, ease, interval, etc. ([GitHub][1])

For notes:

```js
const notes = await anki.searchNotes(
  'deck:"EnglishMastery" "twisted"',
);

console.dir(notes, { depth: null });
```

`notesInfo` gives you the fields, tags, model name, modification time, associated cards, and related information. ([GitHub][1])

---

# Modify a card's actual content

Suppose you find:

```js
const note = await anki.findNote(
  'deck:"EnglishMastery" front:"twisted"',
);

if (!note) {
  throw new Error("Card not found");
}

console.log(note.noteId);
console.log(note.fields);
```

Then:

```js
await anki.updateNoteFields(
  note.noteId,
  {
    Front: "What does twisted mean?",
    Back: "Bent, turned, or wound into a different shape.",
  },
);
```

Or update the entire note:

```js
await anki.updateNote({
  id: note.noteId,

  fields: {
    Front: "What does twisted mean?",
    Back: "Bent, turned, or wound into a different shape.",
  },

  tags: [
    "vocabulary",
    "reviewed",
  ],
});
```

AnkiConnect supports both field-only updates and combined field/tag updates. ([GitHub][2])

One important AnkiConnect quirk: its documentation warns that the note being updated should not currently be open in the Anki browser, otherwise field updates may not apply correctly. ([GitHub][2])

---

# The really powerful stuff

You aren't restricted to changing `Front` and `Back`.

## Change scheduling state

```js
await anki.suspend([cardId]);
```

```js
await anki.unsuspend([cardId]);
```

```js
await anki.forgetCards([cardId]);
```

```js
await anki.relearnCards([cardId]);
```

```js
await anki.setDueDate(
  [cardId],
  "3",
);
```

You can also inspect whether a card is suspended or due:

```js
const suspended = await anki.suspended(cardId);

const due = await anki.areDue([cardId]);

console.log({ suspended, due });
```

AnkiConnect also exposes ease factors and intervals, including complete interval history. ([GitHub][1])

---

# Move cards between decks

```js
await anki.changeDeck(
  [cardId],
  "EnglishMastery::Grammar",
);
```

Or mass-move everything matching a search:

```js
const cards = await anki.findCards(
  'deck:"EnglishMastery::Vocabulary" tag:mastered',
);

await anki.changeDeck(
  cards,
  "EnglishMastery::Mastered",
);
```

---

# Mass-edit your deck

This becomes very interesting with your Anki workflow.

For example:

```js
await anki.bulkUpdateNotes(
  'deck:"EnglishMastery" tag:needs-review',
  {
    Status: "reviewed",
  },
);
```

Or:

```js
const values = await anki.getFieldValues(
  'deck:"EnglishMastery"',
  "Front",
);

console.log(values);
```

Or:

```js
await anki.addTags(
  [123, 456, 789],
  ["processed-by-node"],
);
```

And:

```js
await anki.removeTags(
  [123, 456, 789],
  ["needs-review"],
);
```

You can even replace a tag across notes:

```js
await anki.replaceTagsInAllNotes(
  "old-tag",
  "new-tag",
);
```

The current API exposes dedicated tag operations as well as note-level tag replacement. ([GitHub][1])

---

# Create cards programmatically

This is where AnkiConnect becomes much more than a search API.

```js
const noteId = await anki.addNote({
  deckName: "EnglishMastery",
  modelName: "Basic",

  fields: {
    Front: "What does twisted mean?",
    Back: "Bent or turned into a different shape.",
  },

  tags: [
    "vocabulary",
    "generated",
  ],
});

console.log("Created:", noteId);
```

You can bulk-create:

```js
await anki.addNotes([
  {
    deckName: "EnglishMastery",
    modelName: "Basic",

    fields: {
      Front: "What does reluctant mean?",
      Back: "Unwilling or hesitant.",
    },

    tags: ["vocabulary"],
  },

  {
    deckName: "EnglishMastery",
    modelName: "Basic",

    fields: {
      Front: "What does inevitable mean?",
      Back: "Certain to happen.",
    },

    tags: ["vocabulary"],
  },
]);
```

There are also `canAddNote`, `canAddNotes`, and `canAddNotesWithErrorDetail`, which are useful for validating a batch before actually creating it. ([GitHub][2])

---

# Media is programmable too

You can upload media:

```js
await anki.storeMediaFile({
  filename: "twisted.mp3",
  path: "./audio/twisted.mp3",
});
```

Or from a URL:

```js
await anki.storeMediaFile({
  filename: "twisted.mp3",
  url: "https://example.com/twisted.mp3",
});
```

Then you can retrieve it:

```js
const base64 = await anki.retrieveMediaFile(
  "twisted.mp3",
);
```

And inspect the media folder:

```js
const files = await anki.getMediaFilesNames("*.mp3");

console.log(files);
```

AnkiConnect supports media storage from a filesystem path, URL, or base64 data and can retrieve media as base64. ([GitHub][1])

---

# You can program Anki's note types themselves

This is an area people often overlook.

You can inspect:

```js
await anki.modelNames();
```

```js
await anki.modelFieldNames("Basic");
```

```js
await anki.modelTemplates("Basic");
```

```js
await anki.modelStyling("Basic");
```

You can modify fields:

```js
await anki.modelFieldAdd(
  "Basic",
  "Example",
);
```

Rename:

```js
await anki.modelFieldRename(
  "Basic",
  "Example",
  "Usage",
);
```

Reposition:

```js
await anki.modelFieldReposition(
  "Basic",
  "Usage",
  1,
);
```

And modify templates:

```js
await anki.modelTemplateAdd(
  "Basic",
  {
    Name: "Card 2",
    Front: "{{Usage}}",
    Back: "{{Back}}",
  },
);
```

The API also supports template renaming/repositioning/removal, styling changes, field font configuration, descriptions, and model-level find/replace. ([GitHub][1])

That means Node.js can actually **reconfigure how an entire class of cards is rendered**, not merely edit individual cards.

---

# GUI automation

You can even interact with Anki's GUI:

```js
await anki.guiBrowse(
  'deck:"EnglishMastery" tag:needs-review',
);
```

Select a card:

```js
await anki.guiSelectCard(cardId);
```

Show question:

```js
await anki.guiShowQuestion();
```

Show answer:

```js
await anki.guiShowAnswer();
```

Answer the current card:

```js
await anki.guiAnswerCard(3);
```

Undo:

```js
await anki.guiUndo();
```

And there are GUI actions for deck browser/review, editing notes, importing files, database checking, audio playback, and more. ([GitHub][1])

---

# Batch operations

The `multi` action is particularly useful.

Instead of doing:

```js
await anki.addTags([1], ["processed"]);

await anki.addTags([2], ["processed"]);

await anki.addTags([3], ["processed"]);
```

you can construct a batch:

```js
await anki.multi([
  {
    action: "addTags",
    version: 6,
    params: {
      notes: [1],
      tags: ["processed"],
    },
  },

  {
    action: "addTags",
    version: 6,
    params: {
      notes: [2],
      tags: ["processed"],
    },
  },

  {
    action: "addTags",
    version: 6,
    params: {
      notes: [3],
      tags: ["processed"],
    },
  },
]);
```

This is exactly the sort of thing that makes sense to encapsulate in a service rather than scatter raw HTTP requests throughout your application.

---

# Example: your own AI → Anki pipeline

This is where I'd expect you to get the most value out of this.

You could do:

```js
const anki = new AnkiService();

const note = await anki.findNote(
  'deck:"EnglishMastery" front:"A tangle is something"',
);

if (!note) {
  throw new Error("Note not found");
}

const front = note.fields.Front.value;
const back = note.fields.Back.value;

console.log({ front, back });
```

Then send that text to your AI:

```js
const improvedBack = await generateBetterExplanation(back);
```

Then automatically update Anki:

```js
await anki.updateNoteFields(
  note.noteId,
  {
    Back: improvedBack,
  },
);
```

And tag it:

```js
await anki.addTags(
  [note.noteId],
  ["ai-improved"],
);
```

So your application becomes:

```text
                  ┌──────────────┐
                  │     Anki     │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ AnkiConnect  │
                  └──────┬───────┘
                         │ HTTP
                         ▼
                  ┌──────────────┐
                  │ AnkiService  │
                  └──────┬───────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Search / Edit          Create / Manage
              │                     │
              └──────────┬──────────┘
                         ▼
                         AI
```

And because `raw()` exists, your `AnkiService` doesn't become obsolete every time AnkiConnect adds an action.

### One thing I'd change before using the class above

For a serious project, I'd split it into:

```text
services/
└── anki/
    ├── AnkiService.js       # transport + raw invoke
    ├── AnkiNotes.js         # notes
    ├── AnkiCards.js         # cards
    ├── AnkiDecks.js         # decks
    ├── AnkiModels.js        # note types
    ├── AnkiMedia.js         # media
    ├── AnkiGui.js           # GUI
    └── AnkiStats.js         # statistics
```

and have `AnkiService` compose those modules. That becomes considerably easier to test and maintain once your Anki automation grows.

Also, don't expose AnkiConnect directly to a browser/client application: keep this service server-side. AnkiConnect is normally bound to localhost, and if you change its binding to a network interface, its documentation specifically notes that this changes who can reach it; it also supports an API key for authentication. ([GitHub][1])

[1]: https://github.com/cjappl/anki-connect/blob/master/README.md "anki-connect/README.md at master · cjappl/anki-connect · GitHub"
[2]: https://github.com/cjappl/anki-connect/blob/master/README.md?utm_source=chatgpt.com "anki-connect/README.md at master · cjappl/anki-connect · GitHub"





Yes — but there is an important distinction:

**AnkiConnect does not have an `addNotes` option equivalent to Anki's text-import dropdown `Existing notes → Update`.** `addNote/addNotes` either create notes or reject duplicates; they do not automatically update the matching existing note. ([GitHub][1])

The good news is that we can reproduce **exactly the behavior you want** in `AnkiService`.

### What Anki's importer is doing

For text imports, Anki uses the **first field** to identify a note as existing. If the first field matches an existing note of the same note type, choosing **Update** updates the existing note's other fields while preserving its scheduling information. ([Anki Manual][2])

That maps beautifully to your generator because your first field is:

```js
Front
```

So your desired behavior is:

```text
Warmup note
      │
      ▼
Find existing note with same Front
      │
 ┌────┴─────┐
 │          │
found     not found
 │          │
 ▼          ▼
UPDATE     CREATE
 │          │
 └────┬─────┘
      ▼
     Anki
```

And crucially, `updateNoteFields` changes the existing note rather than deleting/recreating it, so its existing cards and scheduling remain attached to that note. ([GitHub][1])

## I'd add this to `AnkiService`

```js
/**
 * Add notes like Anki's text importer with:
 *
 * Import options → Existing notes → Update
 *
 * Existing notes are identified by the first field.
 */
async upsertNotes({
  deckName,
  modelName,
  notes,
  matchField,
  preserveTags = false,
}) {
  if (!Array.isArray(notes)) {
    throw new TypeError("notes must be an array");
  }

  if (!matchField) {
    throw new Error("matchField is required");
  }

  const existingNotes = await this.searchNotes(
    `deck:"${deckName}"`,
  );

  const existingByField = new Map();

  for (const note of existingNotes) {
    const value = note.fields?.[matchField]?.value;

    if (value != null) {
      existingByField.set(
        this.#normalizeField(value),
        note,
      );
    }
  }

  const created = [];
  const updated = [];
  const skipped = [];

  for (const note of notes) {
    const matchValue = note.fields?.[matchField];

    if (matchValue == null) {
      skipped.push({
        note,
        reason: `Missing match field: ${matchField}`,
      });

      continue;
    }

    const normalizedValue =
      this.#normalizeField(matchValue);

    const existing = existingByField.get(
      normalizedValue,
    );

    if (existing) {
      const fields = {
        ...note.fields,
      };

      // Do not modify the field we're matching on.
      // This mirrors Anki's "first field identifies the note"
      // behavior.
      delete fields[matchField];

      await this.updateNoteFields(
        existing.noteId,
        fields,
      );

      if (!preserveTags && note.tags) {
        await this.updateNoteTags(
          existing.noteId,
          note.tags,
        );
      }

      updated.push({
        noteId: existing.noteId,
        matchValue,
      });

      continue;
    }

    const noteId = await this.addNote({
      deckName,
      modelName,
      fields: note.fields,
      tags: note.tags ?? [],
      options: {
        allowDuplicate: false,
      },
    });

    if (noteId == null) {
      skipped.push({
        note,
        reason: "Anki rejected the note as a duplicate",
      });

      continue;
    }

    created.push({
      noteId,
      matchValue,
    });
  }

  return {
    created,
    updated,
    skipped,
    total: notes.length,
  };
}

#normalizeField(value) {
  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
```

But there's one thing I'd improve in that implementation: **don't search only by deck**.

Your Anki import setting can match duplicates by **note type**, or by **note type + deck**, and the default uniqueness is based on the first field. ([Anki Manual][2])

For your project, I'd make the matching strategy explicit:

```js
await anki.upsertNotes({
  deckName: "Memo DigitMemory",
  modelName: "Memo DigitMemory",
  matchField: "Front",
  notes: warmup.ankiNotes,
});
```

Internally, I'd match:

```text
modelName + Front
```

rather than just:

```text
Front
```

That prevents a completely unrelated note type from accidentally matching one of your warmup cards.

## Even better: use Anki's search engine

Instead of downloading every note in the deck, the service can generate an Anki search for each first-field value.

For example:

```js
const query =
  `note:"Memo DigitMemory" "front content"`;
```

Then:

```js
const existing = await this.searchNotes(query);
```

But for hundreds/thousands of warmup cards, that means a huge number of requests, so I would **not** do one request per card.

A better implementation is:

```text
1. Fetch all relevant notes once
2. Build Map<Front, Note>
3. Process all generated notes locally
4. Batch updates/creates
```

That's substantially faster.

---

# And I would change your `Warmup` data model

This is especially important.

Right now you have:

```js
Fields = [
  Front,
  Answer,
  Back,
  ...
  Tags,
];

return Fields.join`|`;
```

Don't do that anymore.

Make it:

```js
return {
  fields: {
    Front,
    Answer,
    Back: "",
    Image: "",
    AudioBothSides: "",
    AudioFront: "",
    AudioBack: "",
    VideoFront: "",
    VideoBack: "",
    Links: "",
    TTSFront,
    TTSBack,
    FrontPersian: "",
  },

  tags: this.#createTagsField().split(" "),
};
```

Then:

```js
warmup.ankiNotes
```

is already a proper intermediate representation.

Your script becomes:

```js
import AnkiService from "../services/AnkiService.js";
import { warmup } from "./Warmup.js";

const anki = new AnkiService();

const result = await anki.upsertNotes({
  deckName: "Memo DigitMemory",
  modelName: "Memo DigitMemory",
  matchField: "Front",
  notes: warmup.ankiNotes,
});

console.log(result);
```

And you get:

```js
{
  created: [
    { noteId: 123, matchValue: "..." },
    { noteId: 456, matchValue: "..." },
  ],

  updated: [
    { noteId: 789, matchValue: "..." },
    { noteId: 101, matchValue: "..." },
  ],

  skipped: [],

  total: 137
}
```

So when you run the generator again:

```text
First run
137 new notes
       ↓
Second run
0 new
137 updated
       ↓
Third run after changing generator
0 new
137 updated
```

That is essentially the **programmatic equivalent of**:

> Import options → Existing notes → Update

And unlike manually importing a file, you retain the note IDs and can make the operation completely deterministic.

### One subtle point about your `Front`

Your generated `Front` contains HTML:

```html
<span style="...">*</span> ...
```

Anki's duplicate matching for text imports is based on the **first field's content**, so you should make sure the exact HTML generated for an existing warmup remains stable. ([Anki Manual][2])

For your particular deck, though, I think there's an even better design: **give every warmup note a stable logical ID and use that for upserting rather than relying on rendered HTML in `Front`**. That would make your generator robust even if you later change your digit colors, CSS, spacing, or visual formatting.

[1]: https://github.com/ankiultimate/anki-connect?utm_source=chatgpt.com "GitHub - ankiultimate/anki-connect · GitHub"
[2]: https://docs.ankiweb.net/importing/text-files.html?highlight=file+headers&utm_source=chatgpt.com "Text Files - Anki Manual"

