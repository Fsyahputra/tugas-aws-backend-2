const AddedThread = require("../addedThread");

describe("AddedThread Entity", () => {
  const validPayload = {
    id: "thread-1",
    title: "Judul Thread",
    body: "Isi thread",
    date: new Date(),
    owner: "user-1",
  };

  it("should create AddedThread entity correctly", () => {
    const entity = new AddedThread(validPayload);

    expect(entity.id).toBe(validPayload.id);
    expect(entity.title).toBe(validPayload.title);
    expect(entity.body).toBe(validPayload.body);
    expect(entity.date).toBe(validPayload.date);
    expect(entity.owner).toBe(validPayload.owner);
  });

  it("should throw error when payload is not an object", () => {
    expect(() => new AddedThread(null)).toThrow("ADDED_THREAD.NOT_OBJECT");
    expect(() => new AddedThread("abc")).toThrow("ADDED_THREAD.NOT_OBJECT");
  });

  it("should throw error when required property is missing", () => {
    const payload = { ...validPayload };
    delete payload.body;

    expect(() => new AddedThread(payload)).toThrow("ADDED_THREAD.MISSING_BODY");
  });

  it("should throw error when string properties are not string", () => {
    const payload = { ...validPayload, id: 123 };

    expect(() => new AddedThread(payload)).toThrow(
      "ADDED_THREAD.ID_NOT_STRING",
    );
  });

  it("should throw error when date is not Date object", () => {
    const payload = { ...validPayload, date: "2024-01-01" };

    expect(() => new AddedThread(payload)).toThrow(
      "ADDED_THREAD.DATE_NOT_DATE_OBJECT",
    );
  });
});
