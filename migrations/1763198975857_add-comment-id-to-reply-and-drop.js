/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("reply", {
    comment_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  pgm.addConstraint("reply", "fk_reply_comment", {
    foreignKeys: {
      columns: "comment_id",
      references: "comment(id)",
      onDelete: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("reply", "comment_id");
  pgm.dropColumn("comment", "thread_id");
};
