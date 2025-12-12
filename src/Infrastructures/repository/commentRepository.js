const { Pool } = require("pg");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comment/commentRepository");
const AddedComment = require("../../Domains/comment/entities/addedComment");
const { nanoid } = require("nanoid");

/**
 * @implements {CommentRepository}
 */
class CommentRepositoryPostgres extends CommentRepository {
  /**
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._tableName = "comment";
    this._idGenerator = idGenerator;
  }

  /**
   * @param {import("../../Domains/comment/commentRepository").AddPayload} payload
   */
  async add(payload) {
    const { owner, username, content, threadId } = payload;
    const is_deleted = false;
    const id = "comment-" + this._idGenerator();
    const query = {
      text: `INSERT INTO ${this._tableName} (id, content, owner, username, thread_id, is_deleted) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner, username, thread_id, date, is_deleted`,
      values: [id, content, owner, username, threadId, is_deleted],
    };
    const res = await this._pool.query(query);
    const data = res.rows[0];
    return new AddedComment({
      content: data.content,
      date: data.date,
      id: data.id,
      is_deleted: data.is_deleted,
      owner: data.owner,
      thread_id: data.thread_id,
      username: data.username,
    });
  }

  /**
   * @param {string} id
   */
  async delete(id) {
    const query = {
      text: `UPDATE ${this._tableName} SET is_deleted = true WHERE id = $1`,
      values: [id],
    };
    await this._pool.query(query);
  }

  /**
   * @param {string} threadId
   * @returns {Promise<AddedComment[]>}
   */
  async getByThreadId(threadId) {
    const query = {
      text: `SELECT * FROM ${this._tableName} WHERE thread_id = $1`,
      values: [threadId],
    };
    const res = await this._pool.query(query);
    /**
     * @type {AddedComment[]}
     */
    const addedComments = [];
    for (const com of res.rows) {
      addedComments.push(
        new AddedComment({
          id: com.id,
          username: com.username,
          date: com.date,
          content: com.content,
          thread_id: com.thread_id,
          owner: com.owner,
          is_deleted: com.is_deleted,
        }),
      );
    }
    return addedComments;
  }

  /**
   * @param {string}  id
   * @returns {Promise<void>}
   */
  async mustExistOrThrowId(id) {
    const query = {
      text: `SELECT * FRoM ${this._tableName} WHERE id = $1`,
      values: [id],
    };
    const res = await this._pool.query(query);
    if (res.rows.length === 0) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  /**
   * @param {string} id
   * @returns {Promise<AddedComment>}
   */
  async getByCommentId(id) {
    /**
     * @type {import("pg").QueryConfig}
     */
    const getByCommentIdQuery = {
      text: `select * from ${this._tableName} where id = $1`,
      values: [id],
    };

    const res = await this._pool.query(getByCommentIdQuery);
    return new AddedComment({
      ...res.rows[0],
    });
  }
}

module.exports = CommentRepositoryPostgres;
