/**
 * @typedef {object} NewThreadPayload
 * @property {string} title
 * @property {string} body
 * @property {Date} date
 * @property {string} username
 */
class NewThread {
  /**
   * @param {NewThreadPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, date, username } = payload;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }

  /**
   * @private
   * @param {NewThreadPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("NEW_THREAD.NOT_OBJECT");
    }

    /** @type {(keyof NewThreadPayload)[]} */
    const required = ["title", "body", "date", "username"];

    for (const key of required) {
      const value = payload[key];

      if (value === undefined || value === null) {
        throw new Error(`NEW_THREAD.MISSING_${key.toUpperCase()}`);
      }

      switch (key) {
        case "title":
        case "body":
        case "username":
          if (typeof value !== "string") {
            throw new Error(`NEW_THREAD.${key.toUpperCase()}_NOT_STRING`);
          }
          break;

        case "date":
          if (!(value instanceof Date)) {
            throw new Error("NEW_THREAD.DATE_NOT_DATE_OBJECT");
          }
          break;
      }
    }
  }
}

module.exports = NewThread;
