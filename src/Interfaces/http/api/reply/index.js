const { Container } = require("instances-container");
/**
 * @typedef {object} ReplyPluginOptions
 * @property {Container} container
 */

/**
 * @type {import('@hapi/hapi').Plugin<ReplyPluginOptions>}
 */
module.exports = {
  name: "reply",
  /**
   * @param {import('@hapi/hapi').Server} server
   * @param {ReplyPluginOptions} options
   */
  register: async (server, { container }) => {
    const ReplyHandler = require("./handler");
    const ReplyRoutes = require("./routes");

    const replyHandler = new ReplyHandler(container);
    // @type {import('@hapi/hapi').ServerRoute[]}
    const r = ReplyRoutes(replyHandler);
    server.route(r);
  },
};
