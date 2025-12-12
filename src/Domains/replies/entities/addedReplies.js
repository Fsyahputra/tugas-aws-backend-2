/**
 * @typedef {object} AddedRepliesPayload
 * @property {string} id
 * @property {string} content
 * @property {string} owner
 * @property {string} thread_id
 * @property {boolean} is_delete
 * @property {Date} date
 */
class AddedReplies {
  /**
   * @param {AddedRepliesPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner, thread_id, is_delete, date } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
    this.isDelete = is_delete;
    this.threadId = thread_id;
    this.date = date;
  }

  /**
   * @private
   * @param {AddedRepliesPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("ADDED_REPLIES.NOT_OBJECT");
    }

    /** @type {(keyof AddedRepliesPayload)[]} */
    const required = [
      "id",
      "content",
      "owner",
      "thread_id",
      "is_delete",
      "date",
    ];

    for (const key of required) {
      const value = payload[key];
      if (value === undefined || value === null) {
        throw new Error(`ADDED_REPLIES.MISSING_${key.toUpperCase()}`);
      }

      // validasi tipe per-property
      switch (key) {
        case "id":
        case "content":
        case "owner":
        case "thread_id":
          if (typeof value !== "string") {
            throw new Error(`ADDED_REPLIES.${key.toUpperCase()}_NOT_STRING`);
          }
          break;

        case "is_delete":
          if (typeof value !== "boolean") {
            throw new Error("ADDED_REPLIES.IS_DELETED_NOT_BOOLEAN");
          }
          break;

        case "date":
          if (!(value instanceof Date)) {
            throw new Error("ADDED_REPLIES.DATE_NOT_DATE_OBJECT");
          }
          break;
      }
    }
  }
}

module.exports = AddedReplies;
