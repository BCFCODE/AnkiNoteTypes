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

export default class AnkiService {
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
        if (error instanceof AnkiConnectError || attempt >= this.#retries) {
          throw error;
        }

        await this.#sleep(this.#retryDelay * 2 ** attempt);
      }
    }

    throw lastError;
  }

  async #request(action, params) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

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
        throw new AnkiConnectionError("AnkiConnect returned invalid JSON.", {
          cause,
        });
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
        throw new AnkiConnectError(String(payload.error), {
          action,
          params,
        });
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

  setSpecificValueOfCard({ card, keys, newValues, warningCheck = false }) {
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

  findExactNote(notes, newNote) {
    return notes.find((oldNote) => {
      const oldFields = Object.fromEntries(
        Object.entries(oldNote.fields).map(([key, value]) => [
          key,
          value.value,
        ]),
      );

      const sameFront = oldFields.Front === newNote.fields.Front;

      const sameAnswer = oldFields.Answer === newNote.fields.Answer;

      const sameTags =
        JSON.stringify(oldNote.tags.sort()) ===
        JSON.stringify(newNote.tags.sort());

      return sameFront && sameAnswer && sameTags;
    });
  }

  async #findExistingNote(modelName, fields, matchFields) {
    const strategies = Array.isArray(matchFields[0])
      ? matchFields
      : [matchFields];

    for (const strategy of strategies) {
      const queryParts = strategy
        .filter((field) => {
          const value = fields[field];
          return value !== undefined && value !== null && value !== "";
        })
        .map((field) => {
          const value = String(fields[field])
            .replaceAll("\\", "\\\\")
            .replaceAll('"', '\\"');

          return `${field}:"${value}"`;
        });

      if (!queryParts.length) continue;

      const query = `note:${modelName} ${queryParts.join(" ")}`;

      console.log("ANKI SEARCH:", query);

      const noteIds = await this.invoke("findNotes", {
        query,
      });

      if (noteIds.length > 0) {
        return noteIds[0];
      }
    }

    return null;
  }

  /**
   * Add notes like Anki's text importer with:
   *
   * Import options → Existing notes → Update
   *
   * Existing notes are identified by the first field.
   */
  async upsertNotes({ deckName, modelName, notes, matchFields = ["Front"] }) {
    for (const note of notes) {
      const existingNoteId = await this.#findExistingNote(
        modelName,
        note.fields,
        matchFields,
      );

      if (existingNoteId) {
        await this.updateNote({
          noteId: existingNoteId,
          fields: note.fields,
        });

        continue;
      }

      await this.addNote({
        deckName, 
        modelName, 
        fields: note.fields,
        tags: note.tags,
      });
    }
  }

  async findNotesByContent(fields) {
    const query = `"${fields.Front}"`;

    const ids = await this.invoke("findNotes", {
      query,
    });

    if (!ids.length) return [];

    return await this.invoke("notesInfo", {
      notes: ids,
    });
  }

  #normalizeField(value) {
    return String(value)
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  notesInfo(notes) {
    return this.invoke("notesInfo", { notes });
  }

  notesModTime(notes) {
    return this.invoke("notesModTime", { notes });
  }

  async updateNote({ noteId, fields }) {
    return this.invoke("updateNoteFields", {
      note: {
        id: noteId,
        fields,
      },
    });
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
      note: noteId,
      tags,
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

  exportPackage({ deck, path, includeSchedule = true, includeMedia = true }) {
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

  cardReviews({ cards, startID, endID }) {
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

    return this.notesInfo([note.noteId]).then(([updated]) => updated);
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

  #sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
