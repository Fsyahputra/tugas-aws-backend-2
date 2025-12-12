/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("comment", {
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
  pgm.addConstraint("comment", "fk_thread_comment", {
    foreignKeys: {
      columns: "thread_id",
      references: "thread(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {};
