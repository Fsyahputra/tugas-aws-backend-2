const AddedReplies = require("../addedReplies");

describe("AddedReplies Entity", () => {
  const validPayload = {
    id: "reply-123",
    content: "ini balasan",
    owner: "user-1",
    thread_id: "thread-5",
    is_delete: false,
    date: new Date(),
  };

  it("should create AddedReplies object correctly", () => {
    const added = new AddedReplies(validPayload);

    expect(added.id).toBe(validPayload.id);
    expect(added.content).toBe(validPayload.content);
    expect(added.owner).toBe(validPayload.owner);
    expect(added.threadId).toBe(validPayload.thread_id);
    expect(added.isDelete).toBe(validPayload.is_delete);
    expect(added.date).toBe(validPayload.date);
  });

  it("should throw error when payload not an object", () => {
    expect(() => new AddedReplies(null)).toThrow("ADDED_REPLIES.NOT_OBJECT");
    expect(() => new AddedReplies("string")).toThrow(
      "ADDED_REPLIES.NOT_OBJECT",
    );
  });

  it("should throw error when a required property is missing", () => {
    const missingId = { ...validPayload };
    delete missingId.id;

    expect(() => new AddedReplies(missingId)).toThrow(
      "ADDED_REPLIES.MISSING_ID",
    );
  });

  it("should throw error when string fields are not string", () => {
    const invalid = { ...validPayload, id: 123 };

    expect(() => new AddedReplies(invalid)).toThrow(
      "ADDED_REPLIES.ID_NOT_STRING",
    );
  });

  it("should throw error when is_deleted is not boolean", () => {
    const invalid = { ...validPayload, is_delete: "false" };

    expect(() => new AddedReplies(invalid)).toThrow(
      "ADDED_REPLIES.IS_DELETED_NOT_BOOLEAN",
    );
  });

  it("should throw error when date is not Date object", () => {
    const invalid = { ...validPayload, date: "2025-01-01" };

    expect(() => new AddedReplies(invalid)).toThrow(
      "ADDED_REPLIES.DATE_NOT_DATE_OBJECT",
    );
  });
});
