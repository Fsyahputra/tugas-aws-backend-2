const ReplyRepository = require("../../Domains/replies/replyRepository");
const AddedReplies = require("../../Domains/replies/entities/addedReplies");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
class ReplyRepositoryPostgres extends ReplyRepository {
  /**
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGen = idGenerator;
    this._tableName = "reply";
  }

  /**
   * @param {import("../../Domains/replies/replyRepository").AddReplyPayload} payload
   * @returns {Promise<AddedReplies>}
   */

  async add(payload) {
    const { content, owner, threadId, commentId } = payload;
    const id = "reply-" + this._idGen();
    const query = {
      text: `INSERT INTO ${this._tableName} (id, owner, content, is_delete, thread_id,comment_id) VALUES($1, $2, $3, $4, $5, $6 ) RETURNING id, owner, content, is_delete, thread_id, date`,
      values: [id, owner, content, false, threadId, commentId],
    };
    const res = await this._pool.query(query);
    return new AddedReplies({
      id: res.rows[0].id,
      content: res.rows[0].content,
      owner: res.rows[0].owner,
      thread_id: res.rows[0].thread_id,
      date: res.rows[0].date,
      is_delete: res.rows[0].is_delete,
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async del(id) {
    const query = {
      text: `UPDATE ${this._tableName} SET is_delete = true WHERE id = $1`,
      values: [id],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async mustExistOrThrowId(id) {
    const query = {
      text: `SELECT * FROM ${this._tableName} WHERE id = $1`,
      values: [id],
    };
    const res = await this._pool.query(query);
    if (res.rows.length === 0) {
      throw new NotFoundError("balasan tidak ditemukan");
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<AddedReplies>}
   */
  async getById(id) {
    /**
     * @type {import("pg").QueryConfig}
     */
    const getByIdQuery = {
      text: `SELECT * FROM ${this._tableName} where id = $1`,
      values: [id],
    };

    const res = await this._pool.query(getByIdQuery);
    return new AddedReplies({
      ...res.rows[0],
    });
  }

  /**
   * @param {string} commentId
   * @returns {Promise<AddedReplies[]>}
   */
  async getByCommentId(commentId) {
    /**
     * @type {import("pg").QueryConfig}
     */
    const getByCommentIdQuery = {
      text: `SELECT * FROM ${this._tableName} where comment_id = $1 ORDER BY date ASC`,
      values: [commentId],
    };

    const res = await this._pool.query(getByCommentIdQuery);
    return res.rows.map(
      (row) =>
        new AddedReplies({
          ...row,
        }),
    );
  }
}

module.exports = ReplyRepositoryPostgres;
