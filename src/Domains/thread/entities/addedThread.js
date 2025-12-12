/**
 * @typedef {object} AddedThreadPayload
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {Date} date
 * @property {string} owner
 */
class AddedThread {
  /**
   * @param {AddedThreadPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, owner } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.owner = owner;
  }

  /**
   * @private
   * @param {AddedThreadPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("ADDED_THREAD.NOT_OBJECT");
    }

    /** @type {(keyof AddedThreadPayload)[]} */
    const required = ["id", "title", "body", "date", "owner"];

    for (const key of required) {
      const value = payload[key];

      if (value === undefined || value === null) {
        throw new Error(`ADDED_THREAD.MISSING_${key.toUpperCase()}`);
      }

      switch (key) {
        case "id":
        case "title":
        case "body":
        case "owner":
          if (typeof value !== "string") {
            throw new Error(`ADDED_THREAD.${key.toUpperCase()}_NOT_STRING`);
          }
          break;

        case "date":
          if (!(value instanceof Date)) {
            throw new Error("ADDED_THREAD.DATE_NOT_DATE_OBJECT");
          }
          break;
      }
    }
  }
}

module.exports = AddedThread;
