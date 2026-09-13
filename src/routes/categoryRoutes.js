const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validationMiddleware");
const {
  CategoryPayloadSchema,
  CategoryUpdateSchema, // ← tambah
} = require("../utils/validators/categoryValidator");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

router.post(
  "/",
  authMiddleware,
  validate(CategoryPayloadSchema), // ← create
  categoryController.createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  validate(CategoryUpdateSchema), // ← update partial
  categoryController.updateCategory,
);
router.delete("/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;
