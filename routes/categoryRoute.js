import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// routes

// create category ↓
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update category ↓
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// Get all category ↓
router.get("/all-category", categoryController);

// Single category ↓
router.get("/single-category/:slug", singleCategoryController);

// Delete category ↓
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);

export default router;
