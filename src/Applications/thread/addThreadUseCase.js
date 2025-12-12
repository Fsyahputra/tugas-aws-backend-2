/**
 * @typedef {object} AddThreadUseCasePAyload
 * @property {string} accessToken
 * @property {string} title
 * @property {string} body
 */

const AuthenticationError = require("../../Commons/exceptions/AuthenticationError");
const InvariantError = require("../../Commons/exceptions/InvariantError");
const AddThread = require("../../Domains/thread/entities/addThread");
const ThreadRepository = require("../../Domains/thread/ThreadRepository");
const UserRepository = require("../../Domains/users/UserRepository");
const AuthenticationTokenManager = require("../security/AuthenticationTokenManager");

/**
 * @typedef {object} AddThreadUseCaseRT
 * @property {string} id
 * @property {string} title
 * @property {string} owner
 */
class AddThreadUseCase {
  /**
   * @param {ThreadRepository} trp
   * @param {AuthenticationTokenManager} tm
   * @param {UserRepository} usrp
   */
  constructor(trp, tm, usrp) {
    this._trp = trp;
    this._tm = tm;
    this._usrp = usrp;
  }

  /**
   * @param {AddThreadUseCasePAyload} payload
   * @public
   * @returns {Promise<AddThreadUseCaseRT>}
   */
  async execute(payload) {
    this._verifyPayload(payload);
    const { accessToken, title, body } = payload;
    const decoded = await this._tm.decodePayload(accessToken);
    await this._usrp.mustExistOrThrowById(decoded.id);
    const ent = new AddThread({
      owner: decoded.id,
      title: title,
      body: body,
    });
    const addedThread = await this._trp.addThread(ent);
    return {
      id: addedThread.id,
      title: addedThread.title,
      owner: addedThread.owner,
    };
  }

  /**
   * @param {AddThreadUseCasePAyload} payload
   * @private
   */
  _verifyPayload(payload) {
    if (!payload) {
      throw new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { accessToken, title, body } = payload;
    if (!accessToken) {
      throw new Error("ADD_THREAD.AUTHENTICATION_NOT_FOUND");
    }

    if (!title || !body) {
      throw new Error("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof accessToken !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string"
    ) {
      throw new Error("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = AddThreadUseCase;
