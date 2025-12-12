/**
 * @typedef {object} NewRepliesPayload
 * @property {string} content
 * @property {string} owner
 * @property {string} comment_id
 * @property {string} thread_id
 */
class NewReplies {
  /**
   * @param {NewRepliesPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner, comment_id, thread_id } = payload;
    this.content = content;
    this.owner = owner;
    this.threadId = thread_id;
    this.commentId = comment_id;
  }
  /**
   * @private
   * @param {NewRepliesPayload} payload
   */
  _verifyPayload(payload) {
    /** @type {(keyof NewRepliesPayload)[]} */
    const required = ["content", "owner", "comment_id", "thread_id"];

    for (const key of required) {
      if (!payload[key]) {
        throw new Error(`NEW_REPLIES.MISSING_${key.toUpperCase()}`);
      }
      if (typeof payload[key] !== "string") {
        throw new Error(`NEW_REPLIES.${key.toUpperCase()}_NOT_STRING`);
      }
    }
  }
}

module.exports = NewReplies;
