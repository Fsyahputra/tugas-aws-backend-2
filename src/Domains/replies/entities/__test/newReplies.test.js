const NewReplies = require("../newReplies");

describe("NewReplies Entity", () => {
  const validPayload = {
    content: "isi reply",
    owner: "user-1",
    comment_id: "comment-123",
    thread_id: "thread-123",
  };

  it("should create NewReplies entity correctly", () => {
    const entity = new NewReplies(validPayload);

    expect(entity.content).toBe(validPayload.content);
    expect(entity.owner).toBe(validPayload.owner);
    expect(entity.commentId).toBe(validPayload.comment_id);
    expect(entity.threadId).toBe(validPayload.thread_id);
  });

  it("should throw error when required property is missing", () => {
    const payload = { ...validPayload };
    delete payload.content;

    expect(() => new NewReplies(payload)).toThrow(
      "NEW_REPLIES.MISSING_CONTENT",
    );
  });

  it("should throw error when content is not a string", () => {
    const payload = { ...validPayload, content: 123 };

    expect(() => new NewReplies(payload)).toThrow(
      "NEW_REPLIES.CONTENT_NOT_STRING",
    );
  });

  it("should throw error when owner is not a string", () => {
    const payload = { ...validPayload, owner: true };

    expect(() => new NewReplies(payload)).toThrow(
      "NEW_REPLIES.OWNER_NOT_STRING",
    );
  });

  it("should throw error when comment_id is not a string", () => {
    const payload = { ...validPayload, comment_id: {} };

    expect(() => new NewReplies(payload)).toThrow(
      "NEW_REPLIES.COMMENT_ID_NOT_STRING",
    );
  });

  it("should throw error when thread_id is not a string", () => {
    const payload = { ...validPayload, thread_id: 999 };

    expect(() => new NewReplies(payload)).toThrow(
      "NEW_REPLIES.THREAD_ID_NOT_STRING",
    );
  });
});
