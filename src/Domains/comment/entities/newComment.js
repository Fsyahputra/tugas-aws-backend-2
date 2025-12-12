/** @typedef {import('./type').NewCommentPayload} NewCommentPayload */

class NewComment {
  /**
   * @param {NewCommentPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { owner, content, thread_id } = payload;

    this.owner = owner;
    this.content = content;
    this.threadId = thread_id;
  }

  /**
   * @private
   * @param {NewCommentPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("NEW_COMMENT.NOT_OBJECT");
    }

    /** @type {(keyof NewCommentPayload)[]} */
    const required = ["owner", "content", "thread_id"];

    for (const key of required) {
      const value = payload[key];

      if (value === undefined || value === null) {
        throw new Error(`NEW_COMMENT.MISSING_${key.toUpperCase()}`);
      }

      switch (key) {
        case "owner":
        case "content":
        case "thread_id":
          if (typeof value !== "string") {
            throw new Error(`NEW_COMMENT.${key.toUpperCase()}_NOT_STRING`);
          }
          break;
      }
    }
  }
}

module.exports = NewComment;
