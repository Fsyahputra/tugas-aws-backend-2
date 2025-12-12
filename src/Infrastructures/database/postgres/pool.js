const { Pool } = require("pg");

/* istanbul ignore file */
const testConfig = {
  host: process.env.PGHOST_TEST,
  port: process.env.PGPORT_TEST,
  user: process.env.PGUSER_TEST,
  password: process.env.PGPASSWORD_TEST,
  database: process.env.PGDATABASE_TEST,
};

const pool =
  // @ts-expect-error
  process.env.NODE_ENV === "test" ? new Pool(testConfig) : new Pool();

module.exports = pool;
