/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.addColumn("reply", {
    thread_id: {
      type: "varchar(50)",
      notNull: true,
    },
  });

  pgm.addConstraint("reply", "fk_reply_thread", {
    foreignKeys: {
      columns: "thread_id",
      references: "thread(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("reply", "fk_reply_thread");

  pgm.dropColumn("reply", "thread_id");
};
