/**
 * @typedef {object} NewCommentPayload
 * @property {string} owner
 * @property {string} thread_id
 * @property {string} content
 */

/**
 * @typedef {object} AddedCommentPayload
 * @property {boolean} is_deleted
 * @property {string} id
 * @property {string} username
 * @property {Date} date
 * @property {string} content
 * @property {string} thread_id
 * @property {string} owner
 */

/**
 * @typedef {object} DeleteCommentPayload
 * @property {string} ownerId
 * @property {boolean} is_deleted
 */

export {};
