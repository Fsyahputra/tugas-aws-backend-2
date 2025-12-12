const NewThread = require("../newThread");

describe("NewThread entity", () => {
  it("should create NewThread instance correctly", () => {
    const payload = {
      title: "Judul",
      body: "Isi thread",
      date: new Date(),
      username: "fadhil",
    };

    const thread = new NewThread(payload);

    expect(thread.title).toBe(payload.title);
    expect(thread.body).toBe(payload.body);
    expect(thread.date).toBe(payload.date);
    expect(thread.username).toBe(payload.username);
  });

  it("should throw error when payload is not an object", () => {
    expect(() => new NewThread(null)).toThrow("NEW_THREAD.NOT_OBJECT");
    expect(() => new NewThread("abc")).toThrow("NEW_THREAD.NOT_OBJECT");
    expect(() => new NewThread(123)).toThrow("NEW_THREAD.NOT_OBJECT");
  });

  it("should throw error when a required property is missing", () => {
    expect(
      () =>
        new NewThread({
          body: "Isi",
          date: new Date(),
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.MISSING_TITLE");

    expect(
      () =>
        new NewThread({
          title: "Judul",
          date: new Date(),
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.MISSING_BODY");

    expect(
      () =>
        new NewThread({
          title: "Judul",
          body: "Isi",
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.MISSING_DATE");

    expect(
      () =>
        new NewThread({
          title: "Judul",
          body: "Isi",
          date: new Date(),
        }),
    ).toThrow("NEW_THREAD.MISSING_USERNAME");
  });

  it("should throw error when string fields are not string", () => {
    expect(
      () =>
        new NewThread({
          title: 123,
          body: "Isi",
          date: new Date(),
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.TITLE_NOT_STRING");

    expect(
      () =>
        new NewThread({
          title: "Judul",
          body: {},
          date: new Date(),
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.BODY_NOT_STRING");

    expect(
      () =>
        new NewThread({
          title: "Judul",
          body: "Isi",
          date: new Date(),
          username: 999,
        }),
    ).toThrow("NEW_THREAD.USERNAME_NOT_STRING");
  });

  it("should throw error when date is not Date object", () => {
    expect(
      () =>
        new NewThread({
          title: "Judul",
          body: "Isi",
          date: "2020-01-01",
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.DATE_NOT_DATE_OBJECT");

    expect(
      () =>
        new NewThread({
          title: "Judul",
          body: "Isi",
          date: 123456,
          username: "fadhil",
        }),
    ).toThrow("NEW_THREAD.DATE_NOT_DATE_OBJECT");
  });
});
