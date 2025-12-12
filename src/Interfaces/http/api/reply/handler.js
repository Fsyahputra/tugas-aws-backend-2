const { Container } = require("instances-container");
const getTokenFromRequest = require("../utils");
const AddRepylUseCase = require("../../../../Applications/reply/addReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/reply/deleteReplyUseCase");

class ReplyHandler {
  /**
   * @param {Container} container
   */
  constructor(container) {
    /**
     * @private
     */
    this.container = container;
    this.postNewReply = this.postNewReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }

  /**
   * @param {import("@hapi/hapi").Request} r
   * @public
   * @param {import("@hapi/hapi").ResponseToolkit} h
   */
  async postNewReply(r, h) {
    const accessToken = getTokenFromRequest(r);
    const { threadId, commentId } = r.params;
    // @ts-ignore
    const { content } = r.payload;
    /**
     * @type {AddRepylUseCase}
     */
    const addReplyUseCase = this.container.getInstance(AddRepylUseCase.name);
    const newReply = await addReplyUseCase.excute({
      content,
      threadId,
      commentId,
      accessToken,
    });
    const response = h.response({
      status: "success",
      data: {
        addedReply: newReply,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * @param {import("@hapi/hapi").Request} r
   * @public
   * @param {import("@hapi/hapi").ResponseToolkit} h
   */
  async deleteReply(r, h) {
    const accessToken = getTokenFromRequest(r);
    const { threadId, commentId, replyId } = r.params;
    /**
     * @type {DeleteReplyUseCase}
     */
    const deleteReplyUseCase = this.container.getInstance(
      DeleteReplyUseCase.name,
    );
    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      accessToken,
    });
    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = ReplyHandler;
