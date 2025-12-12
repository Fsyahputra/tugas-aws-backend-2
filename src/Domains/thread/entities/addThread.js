/**
 * @typedef {object} AddThreadPayload
 * @property {string} owner
 * @property {string} title
 * @property {string} body
 */

/**
 * @class
 * @property {string} owner
 * @property {string} title
 * @property {string} body
 */
class AddThread {
  /**
   * @param {AddThreadPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, title, body } = payload;
    this.owner = owner;
    this.title = title;
    this.body = body;
  }

  /**
   * @private
   * @param {AddThreadPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("ADD_THREAD.NOT_OBJECT");
    }

    /** @type {(keyof AddThreadPayload)[]} */
    const required = ["owner", "title", "body"];

    for (const key of required) {
      const value = payload[key];

      if (value === undefined || value === null) {
        throw new Error(`ADD_THREAD.MISSING_${key.toUpperCase()}`);
      }

      if (typeof value !== "string") {
        throw new Error(`ADD_THREAD.${key.toUpperCase()}_NOT_STRING`);
      }
    }
  }
}

module.exports = AddThread;
