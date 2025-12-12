const { nanoid } = require("nanoid");
const pool = require("../../database/postgres/pool");
const {
  getReplyById,
  addReply,
  saveReply,
} = require("../../../../tests/replyRepositoryTestHelper.js");
const NewReplies = require("../../../Domains/replies/entities/newReplies");
const ReplyRepositoryPostgres = require("../replyRepository");
const { addUser, saveUser } = require("../../../../tests/UsersTableTestHelper");
const {
  addThread,
  saveThread,
} = require("../../../../tests/threadRepositoryTableTest");
const {
  addComment,
  saveComment,
} = require("../../../../tests/commentRepositoryTableTestHelper");

const service = new ReplyRepositoryPostgres(pool, nanoid);

/**
 * @typedef {object} PrepareThreadRT
 * @property {string} userId
 * @property {string} commentId
 * @property {string} threadId
 */

/**
 * @returns {Promise<PrepareThreadRT>}
 */
async function prepareThread() {
  const newUser = addUser();
  const userId = await saveUser(newUser);
  expect(userId).toBeDefined();
  const newThread = addThread(userId);
  const threadId = await saveThread(newThread);
  expect(threadId).toBeDefined();
  const newComment = addComment(threadId, userId);
  const commentId = await saveComment(newComment);
  expect(commentId).toBeDefined();

  return {
    commentId,
    threadId,
    userId,
  };
}

/**
 * @returns {Promise<string>}
 */
async function prepareReply() {
  const ids = await prepareThread();
  const anotherUser = addUser();
  const anotherUserId = await saveUser(anotherUser);
  const reply = addReply(anotherUserId, ids.commentId, ids.threadId);
  const savedReplyId = await saveReply(reply);
  return savedReplyId;
}

beforeEach(async () => {
  /**
   * @type {import("pg").QueryConfig}
   */
  const cleanUserQuery = {
    text: "delete from users where 1=1",
  };
  /**
   * @type {import("pg").QueryConfig}
   */
  const cleanThreadQuery = {
    text: "delete from thread where 1=1",
  };
  /**
   * @type {import("pg").QueryConfig}
   */
  const cleanCommentQuery = {
    text: "delete from comment where 1=1",
  };
  await pool.query(cleanCommentQuery);
  await pool.query(cleanThreadQuery);
  await pool.query(cleanUserQuery);
});

afterAll(async () => {
  /**
   * @type {import("pg").QueryConfig}
   */
  const cleanUserQuery = {
    text: "delete from users where 1=1",
  };
  /**
   * @type {import("pg").QueryConfig}
   */
  const cleanThreadQuery = {
    text: "delete from thread where 1=1",
  };
  /**
   * @type {import("pg").QueryConfig}
   */
  const cleanCommentQuery = {
    text: "delete from comment where 1=1",
  };
  await pool.query(cleanCommentQuery);
  await pool.query(cleanThreadQuery);
  await pool.query(cleanUserQuery);
  await pool.end();
});

describe("Comment Repository test", () => {
  it("should add reply to the given thread", async () => {
    const ids = await prepareThread();

    const anotherUser = addUser({
      username: "newUser",
    });
    const anotherUserId = await saveUser(anotherUser);

    const newReply = new NewReplies({
      content: "sebuah reply",
      owner: anotherUserId,
      comment_id: ids.commentId,
      thread_id: ids.threadId,
    });

    const addedReply = await service.add(newReply);

    const gettedReply = await getReplyById(addedReply.id);

    expect(gettedReply).toBeDefined();
    expect(gettedReply.content).toBe(addedReply.content);
  });

  it("should soft delete reply", async () => {
    const replyId = await prepareReply();
    await service.del(replyId);
    const gettedReply = await getReplyById(replyId);
    expect(gettedReply).toBeDefined();
    expect(gettedReply.isDelete).toBe(true);
  });

  it("should getThreadByid", async () => {
    const replyId = await prepareReply();
    const gettedReply = await service.getById(replyId);
    expect(gettedReply).toBeDefined();
  });
  it("should throw err if reply did not exist", async () => {
    await expect(service.mustExistOrThrowId("invalidId")).rejects.toThrow(
      "balasan tidak ditemukan",
    );
  });
  it("should resolve to void if reply exist", async () => {
    const replyId = await prepareReply();
    await expect(service.mustExistOrThrowId(replyId)).resolves.toBeUndefined();
  });
});
