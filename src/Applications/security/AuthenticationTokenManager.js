/**
 * @typedef {object} CreateTokenPayload
 * @property {string} id
 * @property {string} username
 */

/**
 * @typedef {object} DecodedToken
 * @property {string} id
 * @property {string} username
 */

class AuthenticationTokenManager {
  /**
   * @param {CreateTokenPayload} payload
   * @returns {Promise<string>}
   */
  async createRefreshToken(payload) {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {CreateTokenPayload} payload
   * @returns {Promise<string>}
   */
  async createAccessToken(payload) {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} token
   * @returns {Promise<void>}
   */
  async verifyRefreshToken(token) {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {string} token
   * @returns {Promise<DecodedToken>}
   */
  async decodePayload(token) {
    throw new Error("AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthenticationTokenManager;
