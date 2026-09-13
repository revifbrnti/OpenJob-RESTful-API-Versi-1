const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/database');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      throw new InvariantError('Email sudah terdaftar');
    }

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [id, name, email, hashedPassword, role],
    );

    return res.status(201).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (err) {
    return next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [req.params.id],
    );

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (err) {
    return next(err);
  }
};
