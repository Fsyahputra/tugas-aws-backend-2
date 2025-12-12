const AddedThread = require("./entities/addedThread");
const AddThread = require("./entities/addThread");

class ThreadRepository {
  /**
   * @param {AddThread} _
   * @returns {Promise<AddedThread>}
   */
  async addThread(_) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} _
   * @returns {Promise<AddedThread>}
   */
  async getThreadById(_) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} _
   * @returns {Promise<void>}
   */
  async mustExistOrThrowId(_) {
    throw new Error("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = ThreadRepository;
