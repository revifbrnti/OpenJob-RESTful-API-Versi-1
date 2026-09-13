const crypto = require("crypto");
const pool = require("../config/database");
const NotFoundError = require("../exceptions/NotFoundError");

exports.createCompany = async (req, res, next) => {
  try {
    const { name, location, description } = req.body;
    const id = crypto.randomUUID();

    const result = await pool.query(
      `INSERT INTO companies (id, name, location, description)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, location, description`,
      [id, name, location, description],
    );

    return res.status(201).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    return next(err);
  }
};

exports.getCompanies = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, description, created_at, updated_at FROM companies ORDER BY created_at ASC",
    );
    return res
      .status(200)
      .json({ status: "success", data: { companies: result.rows } });
  } catch (err) {
    return next(err);
  }
};

exports.getCompanyById = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name, location, description, created_at, updated_at FROM companies WHERE id = $1",
      [req.params.id],
    );
    if (!result.rows.length)
      throw new NotFoundError("Perusahaan tidak ditemukan");
    return res.status(200).json({ status: "success", data: result.rows[0] });
  } catch (err) {
    return next(err);
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Cek company exist
    const check = await pool.query("SELECT id FROM companies WHERE id = $1", [
      id,
    ]);
    if (!check.rows.length) {
      throw new NotFoundError("Perusahaan tidak ditemukan");
    }

    // 2. Dynamic query — hanya update field yang dikirim
    const allowedFields = ["name", "location", "description"];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        values.push(req.body[field]);
        updates.push(`${field} = $${values.length}`);
      }
    }

    updates.push("updated_at = current_timestamp");
    values.push(id);

    const query = `UPDATE companies SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING id`;
    await pool.query(query, values);

    return res.status(200).json({
      status: "success",
      message: "Perusahaan berhasil diperbarui",
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM companies WHERE id = $1 RETURNING id",
      [req.params.id],
    );
    if (!result.rows.length)
      throw new NotFoundError("Perusahaan tidak ditemukan");
    return res
      .status(200)
      .json({ status: "success", message: "Perusahaan berhasil dihapus" });
  } catch (err) {
    return next(err);
  }
};
