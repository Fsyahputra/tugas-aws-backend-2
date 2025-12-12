const DeleteReplies = require("../deleteReplies");

describe("DeleteReplies Entity", () => {
  const validPayload = {
    ownerId: "user-1",
    isDeleted: false,
  };

  describe("constructor", () => {
    it("should create DeleteReplies entity correctly", () => {
      const entity = new DeleteReplies(validPayload);

      expect(entity._ownerId).toBe(validPayload.ownerId);
      expect(entity._isDeleted).toBe(validPayload.isDeleted);
    });

    it("should throw error when payload is not an object", () => {
      expect(() => new DeleteReplies(null)).toThrow(
        "DELETE_REPLIES.NOT_OBJECT",
      );
      expect(() => new DeleteReplies("string")).toThrow(
        "DELETE_REPLIES.NOT_OBJECT",
      );
    });

    it("should throw error when required properties are missing", () => {
      const payload = { ...validPayload };
      delete payload.ownerId;

      expect(() => new DeleteReplies(payload)).toThrow(
        "DELETE_REPLIES.MISSING_OWNERID",
      );
    });

    it("should throw error when ownerId is not a string", () => {
      const payload = { ...validPayload, ownerId: 123 };

      expect(() => new DeleteReplies(payload)).toThrow(
        "DELETE_REPLIES.OWNERID_NOT_STRING",
      );
    });

    it("should throw error when isDeleted is not boolean", () => {
      const payload = { ...validPayload, isDeleted: "false" };

      expect(() => new DeleteReplies(payload)).toThrow(
        "DELETE_REPLIES.ISDELETED_NOT_BOOLEAN",
      );
    });
  });

  describe("deleteReplies()", () => {
    it("should throw error if reply already deleted", () => {
      const entity = new DeleteReplies({
        ownerId: "user-1",
        isDeleted: true,
      });

      expect(() => entity.deleteReplies("user-1")).toThrow(
        "DELETE_REPLIES_ENTITIES.REPLIES_ALREADY_DELETED",
      );
    });

    it("should throw error when userId is not the owner", () => {
      const entity = new DeleteReplies({
        ownerId: "user-1",
        isDeleted: false,
      });

      expect(() => entity.deleteReplies("user-2")).toThrow(
        "DELETE_REPLIES_ENTITIES.ONLY_OWNER_CAN_DELETE_REPLY",
      );
    });

    it("should not throw error when userId is the owner and reply is not deleted", () => {
      const entity = new DeleteReplies(validPayload);

      expect(() => entity.deleteReplies("user-1")).not.toThrow();
    });
  });
});
