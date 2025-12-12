/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  // Menambahkan kolom is_deleted dengan tipe boolean, default false, tidak boleh null
  pgm.addColumn("comment", {
    is_deleted: { type: "boolean", notNull: true, default: false },
  });
};

/**
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  // Menghapus kolom is_deleted jika rollback
  pgm.dropColumn("comment", "is_deleted");
};
