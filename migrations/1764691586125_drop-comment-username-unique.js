/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint("comment", "comment_username_key");
};

exports.down = (pgm) => {
  // OPTIONAL: kalau mau balikin UNIQUE lagi (biasanya tidak diperlukan)
  pgm.addConstraint("comment", "comment_username_key", {
    unique: ["username"],
  });
};
