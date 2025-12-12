class ClientError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=400]
   */
  constructor(message, statusCode = 400) {
    super(message);

    if (this.constructor.name === "ClientError") {
      throw new Error("cannot instantiate abstract class");
    }

    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

module.exports = ClientError;
