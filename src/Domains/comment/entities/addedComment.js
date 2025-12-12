/** @typedef {import('./type').AddedCommentPayload} AddedCommentPayload  */

class AddedComment {
  /**
   * @param {AddedCommentPayload} payload
   */
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, thread_id, owner, is_deleted } =
      payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.threadId = thread_id;
    this.date = date;
    this.owner = owner;
    this.isDeleted = is_deleted;
  }

  /**
   * @private
   * @param {AddedCommentPayload} payload
   */
  _verifyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("ADDED_COMMENT.NOT_OBJECT");
    }

    /** @type {(keyof AddedCommentPayload)[]} */
    const required = [
      "id",
      "username",
      "date",
      "content",
      "thread_id",
      "owner",
      "is_deleted",
    ];

    for (const key of required) {
      const value = payload[key];

      if (value === undefined || value === null) {
        throw new Error(`ADDED_COMMENT.MISSING_${key.toUpperCase()}`);
      }

      switch (key) {
        case "id":
        case "username":
        case "content":
        case "thread_id":
        case "owner":
          if (typeof value !== "string") {
            throw new Error(`ADDED_COMMENT.${key.toUpperCase()}_NOT_STRING`);
          }
          break;

        case "is_deleted":
          if (typeof value !== "boolean") {
            throw new Error("ADDED_COMMENT.IS_DELETED_NOT_BOOLEAN");
          }
          break;

        case "date":
          if (!(value instanceof Date)) {
            throw new Error("ADDED_COMMENT.DATE_NOT_DATE_OBJECT");
          }
          break;
      }
    }
  }
}

module.exports = AddedComment;
