const { Container } = require("instances-container");
const getTokenFromRequest = require("../utils");
const AddThreadUseCase = require("../../../../Applications/thread/addThreadUseCase");
const AddCommentUseCase = require("../../../../Applications/thread/addCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/thread/deleteCommentUseCase");
const getDetailThreadUseCase = require("../../../../Applications/thread/getDetailThread");

class ThreadHandler {
  /**
   * @param {Container} container
   */
  constructor(container) {
    this.container = container;
    this.postAddComment = this.postAddComment.bind(this);
    this.postAddThread = this.postAddThread.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.getDetailThread = this.getDetailThread.bind(this);
  }

  /**
   * @param {import("@hapi/hapi").Request} r
   * @public
   * @param {import("@hapi/hapi").ResponseToolkit} h
   */
  async postAddThread(r, h) {
    const accessToken = getTokenFromRequest(r);
    /**
     * @type {AddThreadUseCase}
     */
    const title = (r.payload && r.payload.title) || "";
    const body = (r.payload && r.payload.body) || "";
    const useCase = this.container.getInstance(AddThreadUseCase.name);
    const info = await useCase.execute({
      accessToken: accessToken,
      body,
      title,
    });
    const response = h.response({
      status: "success",
      data: {
        addedThread: { id: info.id, title: info.title, owner: info.owner },
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
  async postAddComment(r, h) {
    const accessToken = getTokenFromRequest(r);
    // @ts-expect-error
    const { content } = r.payload;
    const { threadId } = r.params;
    /**
     * @type {AddCommentUseCase}
     */
    const useCase = this.container.getInstance(AddCommentUseCase.name);
    const info = await useCase.execute({
      accessToken,
      content,
      threadId,
    });
    const response = h.response({
      status: "success",
      data: {
        addedComment: { id: info.id, content: info.content, owner: info.owner },
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
  async deleteComment(r, h) {
    const accessToken = getTokenFromRequest(r);
    const { commentId, threadId } = r.params;
    /**
     * @type {DeleteCommentUseCase}
     */
    const useCase = this.container.getInstance(DeleteCommentUseCase.name);
    await useCase.execute({
      accessToken,
      commentId,
      threadId,
    });
    const res = h.response({
      status: "success",
    });
    res.code(200);
    return res;
  }

  /**
   * @param {import("@hapi/hapi").Request} r
   * @public
   * @param {import("@hapi/hapi").ResponseToolkit} h
   */
  async getDetailThread(r, h) {
    const { threadId } = r.params;
    /**
     * @type {getDetailThreadUseCase}
     */
    const useCase = this.container.getInstance(getDetailThreadUseCase.name);
    const info = await useCase.execute({
      threadId,
    });
    const res = h.response({
      status: "success",
      data: {
        thread: info,
      },
    });
    res.code(200);
    return res;
  }
}

module.exports = ThreadHandler;
