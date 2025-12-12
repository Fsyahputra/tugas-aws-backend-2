/**
 * @abstract
 * @class
 */
class AuthenticationRepository {
  constructor() {}
  /**
   * @param {string} token
   */
  async addToken(token) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} token
   */
  async checkAvailabilityToken(token) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} token
   */
  async deleteToken(token) {
    throw new Error("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthenticationRepository;
