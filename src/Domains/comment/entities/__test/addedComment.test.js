const AddedComment = require("../addedComment");

describe("AddedComment Entity", () => {
  const validPayload = {
    id: "comment-123",
    username: "fadhil",
    date: new Date(),
    content: "komentar",
    thread_id: "thread-1",
    owner: "user-1",
    is_deleted: false,
  };

  it("should create AddedComment entity correctly", () => {
    const entity = new AddedComment(validPayload);

    expect(entity.id).toBe(validPayload.id);
    expect(entity.username).toBe(validPayload.username);
    expect(entity.content).toBe(validPayload.content);
    expect(entity.threadId).toBe(validPayload.thread_id);
    expect(entity.date).toBe(validPayload.date);
    expect(entity.owner).toBe(validPayload.owner);
    expect(entity.isDeleted).toBe(validPayload.is_deleted);
  });

  it("should throw error when payload is not an object", () => {
    expect(() => new AddedComment(null)).toThrow("ADDED_COMMENT.NOT_OBJECT");
    expect(() => new AddedComment("abc")).toThrow("ADDED_COMMENT.NOT_OBJECT");
  });

  it("should throw error when required property is missing", () => {
    const payload = { ...validPayload };
    delete payload.content;

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.MISSING_CONTENT",
    );
  });

  it("should throw error when id is not string", () => {
    const payload = { ...validPayload, id: 123 };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.ID_NOT_STRING",
    );
  });

  it("should throw error when username is not string", () => {
    const payload = { ...validPayload, username: {} };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.USERNAME_NOT_STRING",
    );
  });

  it("should throw error when content is not string", () => {
    const payload = { ...validPayload, content: 999 };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.CONTENT_NOT_STRING",
    );
  });

  it("should throw error when thread_id is not string", () => {
    const payload = { ...validPayload, thread_id: true };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.THREAD_ID_NOT_STRING",
    );
  });

  it("should throw error when owner is not string", () => {
    const payload = { ...validPayload, owner: [] };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.OWNER_NOT_STRING",
    );
  });

  it("should throw error when is_deleted is not boolean", () => {
    const payload = { ...validPayload, is_deleted: "yes" };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.IS_DELETED_NOT_BOOLEAN",
    );
  });

  it("should throw error when date is not a Date instance", () => {
    const payload = { ...validPayload, date: "2024-01-01" };

    expect(() => new AddedComment(payload)).toThrow(
      "ADDED_COMMENT.DATE_NOT_DATE_OBJECT",
    );
  });
});
