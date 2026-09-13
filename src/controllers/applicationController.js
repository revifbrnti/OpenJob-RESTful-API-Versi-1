const crypto = require('crypto');
const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');

exports.createApplication = async (req, res, next) => {
  try {
    const { user_id: userId, job_id: jobId, status = 'pending' } = req.body;

    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (!userCheck.rows.length) throw new NotFoundError('User tidak ditemukan');

    const jobCheck = await pool.query('SELECT id FROM jobs WHERE id = $1', [jobId]);
    if (!jobCheck.rows.length) throw new NotFoundError('Pekerjaan tidak ditemukan');

    const id = crypto.randomUUID();
    const result = await pool.query(
      `INSERT INTO applications (id, user_id, job_id, status)
       VALUES ($1, $2, $3, $4) RETURNING id, user_id, job_id, status`,
      [id, userId, jobId, status],
    );

    return res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    return next(err);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, job_id, status, created_at, updated_at
       FROM applications ORDER BY created_at ASC`,
    );
    return res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (err) {
    return next(err);
  }
};

exports.getApplicationById = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, job_id, status, created_at, updated_at
       FROM applications WHERE id = $1`,
      [req.params.id],
    );
    if (!result.rows.length) throw new NotFoundError('Lamaran tidak ditemukan');
    return res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    return next(err);
  }
};

exports.getApplicationsByUser = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, job_id, status, created_at, updated_at
       FROM applications WHERE user_id = $1 ORDER BY created_at ASC`,
      [req.params.userId],
    );
    return res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (err) {
    return next(err);
  }
};

exports.getApplicationsByJob = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, job_id, status, created_at, updated_at
       FROM applications WHERE job_id = $1 ORDER BY created_at ASC`,
      [req.params.jobId],
    );
    return res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (err) {
    return next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const result = await pool.query(
      `UPDATE applications SET status = $1, updated_at = current_timestamp
       WHERE id = $2 RETURNING id`,
      [req.body.status, req.params.id],
    );
    if (!result.rows.length) throw new NotFoundError('Lamaran tidak ditemukan');
    return res.status(200).json({ status: 'success', message: 'Status lamaran berhasil diperbarui' });
  } catch (err) {
    return next(err);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM applications WHERE id = $1 RETURNING id',
      [req.params.id],
    );
    if (!result.rows.length) throw new NotFoundError('Lamaran tidak ditemukan');
    return res.status(200).json({ status: 'success', message: 'Lamaran berhasil dihapus' });
  } catch (err) {
    return next(err);
  }
};
