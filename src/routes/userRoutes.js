const express = require("express");
const router = express.Router();
const { registerUser, getUserById } = require("../controllers/userController");
const validate = require("../middlewares/validationMiddleware");
const { UserPayloadSchema } = require("../utils/validators/userValidator");

router.post("/", validate(UserPayloadSchema), registerUser);
router.get("/:id", getUserById);

module.exports = router;
