const DeleteComment = require("../deleteComment");

describe("DeleteComment Entity", () => {
  const validPayload = {
    ownerId: "user-1",
    is_deleted: false,
  };

  it("should create DeleteComment entity correctly", () => {
    const entity = new DeleteComment(validPayload);

    expect(entity.ownerId).toBe(validPayload.ownerId);
    expect(entity.isDeleted).toBe(validPayload.is_deleted);
  });

  it("should throw error when payload is not an object", () => {
    expect(() => new DeleteComment(null)).toThrow("DELETE_COMMENT.NOT_OBJECT");
    expect(() => new DeleteComment("abc")).toThrow("DELETE_COMMENT.NOT_OBJECT");
  });

  it("should throw error when required property is missing", () => {
    const payload = { ...validPayload };
    delete payload.ownerId;

    expect(() => new DeleteComment(payload)).toThrow(
      "DELETE_COMMENT.MISSING_OWNERID",
    );
  });

  it("should throw error when ownerId is not string", () => {
    const payload = { ...validPayload, ownerId: 123 };

    expect(() => new DeleteComment(payload)).toThrow(
      "DELETE_COMMENT.OWNERID_NOT_STRING",
    );
  });

  it("should throw error when is_deleted is not boolean", () => {
    const payload = { ...validPayload, is_deleted: "false" };

    expect(() => new DeleteComment(payload)).toThrow(
      "DELETE_COMMENT.IS_DELETED_NOT_BOOLEAN",
    );
  });

  // ====== deleteComment behavior ======

  it("should throw error when deleting comment that is already deleted", () => {
    const entity = new DeleteComment({ ownerId: "user-1", is_deleted: true });

    expect(() => entity.deleteComment("user-1")).toThrow(
      "DELETE_COMMENT_ENTITIES.COMMENT_ALREADY_DELETED",
    );
  });

  it("should throw error when non-owner tries to delete comment", () => {
    const entity = new DeleteComment({ ownerId: "user-1", is_deleted: false });

    expect(() => entity.deleteComment("user-2")).toThrow(
      "DELETE_COMMENT_ENTITIES.ONLY_OWNER_CAN_DELETE_COMMENT",
    );
  });

  it("should not throw when owner deletes comment and isDeleted = false", () => {
    const entity = new DeleteComment({ ownerId: "user-1", is_deleted: false });

    expect(() => entity.deleteComment("user-1")).not.toThrow();
  });
});
