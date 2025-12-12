const NewComment = require("../newComment");

describe("NewComment Entity", () => {
  const validPayload = {
    owner: "user-1",
    content: "Ini komentar",
    thread_id: "thread-123",
  };

  it("should create NewComment entity correctly", () => {
    const entity = new NewComment(validPayload);

    expect(entity.owner).toBe(validPayload.owner);
    expect(entity.content).toBe(validPayload.content);
    expect(entity.threadId).toBe(validPayload.thread_id);
  });

  it("should throw error when payload is not an object", () => {
    expect(() => new NewComment(null)).toThrow("NEW_COMMENT.NOT_OBJECT");
    expect(() => new NewComment("abc")).toThrow("NEW_COMMENT.NOT_OBJECT");
  });

  it("should throw error when required property is missing", () => {
    const payload = { ...validPayload };
    delete payload.content;

    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.MISSING_CONTENT",
    );
  });

  it("should throw error when owner is not a string", () => {
    const payload = { ...validPayload, owner: 123 };

    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.OWNER_NOT_STRING",
    );
  });

  it("should throw error when content is not a string", () => {
    const payload = { ...validPayload, content: true };

    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.CONTENT_NOT_STRING",
    );
  });

  it("should throw error when thread_id is not a string", () => {
    const payload = { ...validPayload, thread_id: {} };

    expect(() => new NewComment(payload)).toThrow(
      "NEW_COMMENT.THREAD_ID_NOT_STRING",
    );
  });
});
