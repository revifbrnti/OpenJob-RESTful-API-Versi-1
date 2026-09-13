const pool = require('../config/database');
const NotFoundError = require('../exceptions/NotFoundError');

exports.getProfile = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [req.user.id],
    );
    if (!result.rows.length) throw new NotFoundError('User tidak ditemukan');
    return res.status(200).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    return next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT applications.id, applications.user_id, applications.job_id,
              applications.status, applications.created_at, applications.updated_at,
              jobs.title AS job_title, companies.name AS company_name
       FROM applications
       JOIN jobs ON applications.job_id = jobs.id
       JOIN companies ON jobs.company_id = companies.id
       WHERE applications.user_id = $1
       ORDER BY applications.created_at ASC`,
      [req.user.id],
    );
    return res.status(200).json({ status: 'success', data: { applications: result.rows } });
  } catch (err) {
    return next(err);
  }
};

exports.getMyBookmarks = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT bookmarks.id, bookmarks.user_id, bookmarks.job_id, bookmarks.created_at,
              jobs.title AS job_title, companies.name AS company_name
       FROM bookmarks
       JOIN jobs ON bookmarks.job_id = jobs.id
       JOIN companies ON jobs.company_id = companies.id
       WHERE bookmarks.user_id = $1
       ORDER BY bookmarks.created_at ASC`,
      [req.user.id],
    );
    return res.status(200).json({ status: 'success', data: { bookmarks: result.rows } });
  } catch (err) {
    return next(err);
  }
};
