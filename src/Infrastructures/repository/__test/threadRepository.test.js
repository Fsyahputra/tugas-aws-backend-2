const { nanoid } = require("nanoid");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../threadRepository.js");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");
const {
  generateAddThreadPayload,
  ThreadHelperGetThreadById,
} = require("../../../../tests/threadRepositoryTableTest");
const AddedThread = require("../../../Domains/thread/entities/addedThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const {
  registerUser,
  UserHelperAddUser,
} = require("../../../../tests/UsersTableTestHelper");

const fakeIdGenerator = () => "123"; // stub!
const service = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
const userService = new UserRepositoryPostgres(pool, fakeIdGenerator);
beforeEach(async () => {
  /**
   * @type {import("pg").QueryConfig}
   */
  const deleteThreadQuery = {
    text: "delete from thread",
  };
  /**
   * @type {import("pg").QueryConfig}
   */
  const deleteUserQuery = {
    text: "delete from users",
  };
  await pool.query(deleteThreadQuery);
  await pool.query(deleteUserQuery);
});

afterAll(async () => {
  /**
   * @type {import("pg").QueryConfig}
   */
  const deleteThreadQuery = {
    text: "delete from thread",
  };
  /**
   * @type {import("pg").QueryConfig}
   */
  const deleteUserQuery = {
    text: "delete from users",
  };
  await pool.query(deleteThreadQuery);
  await pool.query(deleteUserQuery);
  await pool.end();
});

const createUserAndThreadPayload = async () => {
  const newUserPayload = registerUser();
  const newUser = await UserHelperAddUser(newUserPayload);
  const newThread = generateAddThreadPayload(newUser.id);
  return { newUser, newThread };
};

const createUserAndThread = async () => {
  const { newUser, newThread } = await createUserAndThreadPayload();
  const addedThread = await service.addThread(newThread);
  return { newUser, added: addedThread, newThread };
};

describe("ThreadRepositoryPostgres", () => {
  it("Should addThread", async () => {
    const { newThread, newUser } = await createUserAndThreadPayload();
    const added = await service.addThread(newThread);
    expect(added.id).toBeDefined();
    const check = await ThreadHelperGetThreadById(added.id);
    expect(check).toBeInstanceOf(AddedThread);
    expect(check.body).toBe(newThread.body);
    expect(check.owner).toBe(newThread.owner);
    expect(check.title).toBe(newThread.title);
    expect(check.id).toBe(added.id);
    expect(check.date).toBeInstanceOf(Date);
    expect(check.date).toStrictEqual(added.date);
  });

  it("Should getThreadById", async () => {
    const { newUser, added, newThread } = await createUserAndThread();
    expect(added.id).toBeDefined();
    const addedThread = await service.getThreadById(added.id);
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toBe(added.id);
    expect(addedThread.body).toBe(newThread.body);
    expect(addedThread.owner).toBe(newThread.owner);
    expect(addedThread.title).toBe(newThread.title);
    expect(addedThread.date).toBeDefined();
    expect(addedThread.date).toBeInstanceOf(Date);
    expect(addedThread.date).toStrictEqual(added.date);
  });

  it("should throw err if thread did not exist", async () => {
    await expect(service.mustExistOrThrowId("invalid id")).rejects.toThrow(
      "thread tidak ditemukan",
    );
    await expect(service.mustExistOrThrowId("thread-123")).rejects.toThrow(
      NotFoundError,
    );
  });
});
