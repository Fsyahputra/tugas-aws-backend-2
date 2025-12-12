/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn("comment", {
    is_delete: {
      type: "BOOLEAN",
      default: false,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("comment", "is_delete");
};
