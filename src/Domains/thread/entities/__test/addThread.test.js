const AddThread = require("../addThread");

describe("AddThread entity", () => {
  it("should create AddThread instance correctly", () => {
    const payload = {
      owner: "user-123",
      title: "Judul Thread",
      body: "Isi thread",
    };

    const thread = new AddThread(payload);

    expect(thread.owner).toBe(payload.owner);
    expect(thread.title).toBe(payload.title);
    expect(thread.body).toBe(payload.body);
  });

  it("should throw error when payload is not an object", () => {
    expect(() => new AddThread(null)).toThrow("ADD_THREAD.NOT_OBJECT");
    expect(() => new AddThread("abc")).toThrow("ADD_THREAD.NOT_OBJECT");
    expect(() => new AddThread(123)).toThrow("ADD_THREAD.NOT_OBJECT");
  });

  it("should throw error when a required property is missing", () => {
    expect(
      () =>
        new AddThread({
          title: "Judul",
          body: "Isi",
        }),
    ).toThrow("ADD_THREAD.MISSING_OWNER");

    expect(
      () =>
        new AddThread({
          owner: "user-1",
          body: "Isi",
        }),
    ).toThrow("ADD_THREAD.MISSING_TITLE");

    expect(
      () =>
        new AddThread({
          owner: "user-1",
          title: "Judul",
        }),
    ).toThrow("ADD_THREAD.MISSING_BODY");
  });

  it("should throw error when a required property is not a string", () => {
    expect(
      () =>
        new AddThread({
          owner: 123,
          title: "Judul",
          body: "Isi",
        }),
    ).toThrow("ADD_THREAD.OWNER_NOT_STRING");

    expect(
      () =>
        new AddThread({
          owner: "user",
          title: 999,
          body: "Isi",
        }),
    ).toThrow("ADD_THREAD.TITLE_NOT_STRING");

    expect(
      () =>
        new AddThread({
          owner: "user",
          title: "Judul",
          body: {},
        }),
    ).toThrow("ADD_THREAD.BODY_NOT_STRING");
  });
});
