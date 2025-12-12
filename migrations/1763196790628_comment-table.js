/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comment", {
    id: {
      type: "VARCHAR(50)",
      notNull: true,
      primaryKey: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    username: {
      type: "VARCHAR(50)",
      notNull: true,
      unique: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("comment", "fk_owner_comment", {
    foreignKeys: {
      columns: "owner",
      references: "users(id)",
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("comment", "fk_username_comment", {
    foreignKeys: {
      columns: "username",
      references: "users(username)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comment");
};
