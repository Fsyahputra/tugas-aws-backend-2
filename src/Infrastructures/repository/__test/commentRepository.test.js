const { nanoid } = require("nanoid");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../commentRepository");
const {
  getCommentById: helperGetCommentById,
  addComment,
  saveComment2,
} = require("../../../../tests/commentRepositoryTableTestHelper");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedComment = require("../../../Domains/comment/entities/addedComment");
const { addUser, saveUser } = require("../../../../tests/UsersTableTestHelper");
const {
  addThread,
  saveThread,
} = require("../../../../tests/threadRepositoryTableTest");

/**
 * @typedef {object} prepareThreadRT
 * @property {string} threadOwnerId
 * @property {string} threadId
 * @property {string} userId
 * @property {RegisterUser} newUser
 */

beforeEach(async () => {
  /**
   * @type {import("pg").QueryConfig}
   */
  const userCleanQuery = {
    text: "delete from users",
  };

  /**
   * @type {import("pg").QueryConfig}
   */

  const threadCleasnQuery = {
    text: "delete from thread",
  };

  /**
   * @type {import("pg").QueryConfig}
   */
  const commentCleanQuery = {
    text: "delete from comment",
  };

  await pool.query(userCleanQuery);
  await pool.query(commentCleanQuery);
  await pool.query(threadCleasnQuery);
});

afterAll(async () => {
  /**
   * @type {import("pg").QueryConfig}
   */
  const userCleanQuery = {
    text: "delete from users",
  };

  /**
   * @type {import("pg").QueryConfig}
   */

  const threadCleasnQuery = {
    text: "delete from thread",
  };

  /**
   * @type {import("pg").QueryConfig}
   */
  const commentCleanQuery = {
    text: "delete from comment",
  };

  await pool.query(userCleanQuery);
  await pool.query(commentCleanQuery);
  await pool.query(threadCleasnQuery);
  await pool.end();
});

/**
 * @returns {Promise< prepareThreadRT >}
 */
async function prepareThread() {
  const newUser = addUser();
  const userId = await saveUser(newUser);
  const newThread = addThread(userId);
  const threadId = await saveThread(newThread);

  return {
    threadId,
    threadOwnerId: userId,
    newUser,
    userId,
  };
}

/**
 * @returns {Promise<{
 * commentId : string,
 * threadId : string
 * }>}
 */
async function prepareThreadAndComment() {
  const ids = await prepareThread();
  const newUser = addUser();

  const userId = await saveUser(newUser);
  expect(userId).toBeDefined();
  const newComment = addComment(ids.threadId, userId);
  const commentId = await saveComment2({
    content: newComment.content,
    owner: newComment.owner,
    threadId: newComment.threadId,
    username: newUser.username,
  });
  return {
    commentId: commentId,
    threadId: ids.threadId,
  };
}

const service = new CommentRepositoryPostgres(pool, nanoid);
describe("commentRepository test", () => {
  it("should add a comment to a given thread", async () => {
    const ids = await prepareThread();
    /**
     * @type {import("../../../Domains/comment/commentRepository").AddPayload}
     */
    const commentPayload = {
      content: "sebuah comment",
      owner: ids.userId,
      threadId: ids.threadId,
      username: ids.newUser.username,
    };
    const addedComment = await service.add(commentPayload);
    const gettedComment = await helperGetCommentById(addedComment.id);
    // instance check
    expect(gettedComment).toBeInstanceOf(AddedComment);

    // value checks
    expect(gettedComment.id).toBe(addedComment.id);
    expect(gettedComment.username).toBe(addedComment.username);
    expect(gettedComment.content).toBe(addedComment.content);
    expect(gettedComment.threadId).toBe(addedComment.threadId);
    expect(gettedComment.owner).toBe(addedComment.owner);

    expect(gettedComment.date).toBeInstanceOf(Date);
    expect(gettedComment.date.getTime()).toBe(addedComment.date.getTime());

    expect(gettedComment.isDeleted).toBe(addedComment.isDeleted);

    // type checks
    expect(typeof gettedComment.id).toBe("string");
    expect(typeof gettedComment.username).toBe("string");
    expect(typeof gettedComment.content).toBe("string");
    expect(typeof gettedComment.threadId).toBe("string");
    expect(typeof gettedComment.owner).toBe("string");
    expect(typeof gettedComment.isDeleted).toBe("boolean");
  });
  it("should delete comment ", async () => {
    const ids = await prepareThread();
    /**
     * @type {import("../../../Domains/comment/commentRepository").AddPayload}
     */
    const commentPayload = {
      content: "sebuah comment",
      owner: ids.userId,
      threadId: ids.threadId,
      username: ids.newUser.username,
    };
    const commentId = await saveComment2(commentPayload);
    await service.delete(commentId);
    const gettedComment = await helperGetCommentById(commentId);
    // instance check
    expect(gettedComment).toBeInstanceOf(AddedComment);

    // value checks
    expect(gettedComment.id).toBe(commentId);
    expect(gettedComment.username).toBe(commentPayload.username);
    expect(gettedComment.content).toBe(commentPayload.content);
    expect(gettedComment.threadId).toBe(commentPayload.threadId);
    expect(gettedComment.owner).toBe(commentPayload.owner);

    expect(gettedComment.date).toBeInstanceOf(Date);
    expect(gettedComment.isDeleted).toBe(true);
    // type checks
    expect(typeof gettedComment.id).toBe("string");
    expect(typeof gettedComment.username).toBe("string");
    expect(typeof gettedComment.content).toBe("string");
    expect(typeof gettedComment.threadId).toBe("string");
    expect(typeof gettedComment.owner).toBe("string");
    expect(typeof gettedComment.isDeleted).toBe("boolean");
  });

  it("should getCommentByid", async () => {
    const ids = await prepareThreadAndComment();
    expect(ids.commentId).toBeDefined();
    expect(ids.threadId).toBeDefined();
    const gettedComment = await service.getByCommentId(ids.commentId);
    expect(gettedComment).toBeDefined();
    expect(gettedComment.id).toBe(ids.commentId);

    expect(gettedComment).toBeInstanceOf(AddedComment);

    expect(gettedComment.id).toBeDefined();
    expect(gettedComment.username).toBeDefined();
    expect(gettedComment.content).toBeDefined();
    expect(gettedComment.threadId).toBeDefined();
    expect(gettedComment.date).toBeDefined();
    expect(gettedComment.owner).toBeDefined();
    expect(gettedComment.isDeleted).toBeDefined();

    // cek type dari tiap property
    expect(typeof gettedComment.id).toBe("string");
    expect(typeof gettedComment.username).toBe("string");
    expect(typeof gettedComment.content).toBe("string");
    expect(typeof gettedComment.threadId).toBe("string");
    expect(typeof gettedComment.owner).toBe("string");
    expect(typeof gettedComment.isDeleted).toBe("boolean");
    expect(gettedComment.date).toBeInstanceOf(Date);
  });

  it("should getCommentByThreadId", async () => {
    const ids = await prepareThreadAndComment();
    expect(ids.commentId).toBeDefined();
    expect(ids.threadId).toBeDefined();
    const gettedComments = await service.getByThreadId(ids.threadId);
    expect(gettedComments).toBeDefined();
    expect(Array.isArray(gettedComments)).toBe(true);
    expect(gettedComments.length).toBeGreaterThan(0);
    const comment = gettedComments[0];
    // instance check (jika menggunakan entity AddedComment)
    expect(comment).toBeInstanceOf(AddedComment);
    expect(comment.id).toBeDefined();
    expect(comment.username).toBeDefined();
    expect(comment.content).toBeDefined();
    expect(comment.threadId).toBeDefined();
    expect(comment.owner).toBeDefined();
    expect(comment.date).toBeDefined();
    expect(comment.isDeleted).toBeDefined();
    expect(typeof comment.id).toBe("string");
    expect(typeof comment.username).toBe("string");
    expect(typeof comment.content).toBe("string");
    expect(typeof comment.threadId).toBe("string");
    expect(typeof comment.owner).toBe("string");
    expect(typeof comment.isDeleted).toBe("boolean");
    expect(comment.date).toBeInstanceOf(Date);
    expect(comment.id).toBe(ids.commentId);
  });

  it("should throw err if comment did not exist", async () => {
    await expect(service.mustExistOrThrowId("invalid id")).rejects.toThrow(
      "komentar tidak ditemukan",
    );

    await expect(service.mustExistOrThrowId("cmt-123456")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should resolves to void if comment exist", async () => {
    const ids = await prepareThreadAndComment();
    expect(ids.commentId).toBeDefined();
    expect(ids.threadId).toBeDefined();
    await expect(
      service.mustExistOrThrowId(ids.commentId),
    ).resolves.not.toThrow(NotFoundError);
    await expect(
      service.mustExistOrThrowId(ids.commentId),
    ).resolves.toBeUndefined();
  });
});
