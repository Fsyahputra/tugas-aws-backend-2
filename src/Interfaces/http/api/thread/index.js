const { Container } = require("instances-container");
const ThreadHandler = require("./handler");
const ThreadRoutes = require("./routes");

/**
 * @typedef {object} ThreadPluginOptions
 * @property {Container} container
 */

/**
 * @type {import('@hapi/hapi').Plugin<ThreadPluginOptions>}
 */
module.exports = {
  name: "thread",
  /**
   * @param {import('@hapi/hapi').Server} server
   * @param {ThreadPluginOptions} options
   */
  register: async (server, { container }) => {
    const threadHandler = new ThreadHandler(container);
    // @type {import('@hapi/hapi').ServerRoute[]}
    const r = ThreadRoutes(threadHandler);
    server.route(r);
  },
};
