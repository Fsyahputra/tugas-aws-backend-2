const AddedThread = require("../../Domains/thread/entities/addedThread");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const AddThread = require("../../Domains/thread/entities/addThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ThreadRepositoryPostgres extends ThreadRepository {
  /**
   * @param {Pool} pool
   * @param {nanoid} idGenerator
   */
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._tableName = "thread";
  }

  /**
   * @param {AddThread} payload
   * @returns {Promise<AddedThread>}
   */
  async addThread(payload) {
    const id = "thread-" + this._idGenerator();
    const { title, body, owner } = payload;
    const query = {
      text: `INSERT INTO ${this._tableName} (id, title, body, owner) VALUES($1, $2, $3, $4) RETURNING id, title, body, owner, date`,
      values: [id, title, body, owner],
    };
    const res = await this._pool.query(query);
    return new AddedThread({ ...res.rows[0] });
  }

  /**
   * @param {string} id
   * @returns {Promise<AddedThread>}
   */
  async getThreadById(id) {
    const query = {
      text: `SELECT * FROM ${this._tableName} WHERE id = $1`,
      values: [id],
    };
    const res = await this._pool.query(query);
    return new AddedThread({
      ...res.rows[0],
    });
  }

  /**
   * @param {string} id
   * @returns {Promise<void>}
   */
  async mustExistOrThrowId(id) {
    /**
     * @type {import("pg").QueryConfig}
     */
    const query = {
      text: `SELECT * FROM ${this._tableName} WHERE id = $1`,
      values: [id],
    };
    const res = await this._pool.query(query);
    if (res.rows.length === 0) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
