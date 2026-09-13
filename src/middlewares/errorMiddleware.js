const ClientError = require("../exceptions/ClientError");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message,
    });
  }

  if (err.code === "23505") {
    return res.status(400).json({
      status: "failed",
      message: "Data already exists",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      status: "failed",
      message: "Referenced data does not exist",
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "failed",
    message: "Internal server error",
  });
};

module.exports = errorMiddleware;
