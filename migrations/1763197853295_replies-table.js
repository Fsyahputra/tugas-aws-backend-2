/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("reply", {
    id: {
      type: "VARCHAR(50)",
      notNull: true,
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      default: pgm.func("current_timestamp"),
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
      notNull: true,
    },
  });
  pgm.addConstraint("reply", "fk_owner_reply", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("reply");
};
