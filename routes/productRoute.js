import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  allProductsController,
  braintreePaymentsController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  photoProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  searchProductController,
  similarProductController,
  singleProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes

// create product ↓
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// update product ↓
router.put(
  "/update-product/:pId",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// Delete product ↓
router.delete(
  "/delete-product/:pId",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// fetch all products ↓
router.get("/all-products", allProductsController);

// fetch single product ↓
router.get("/all-products/:slug", singleProductController);

// fetch photo ↓
router.get("/product-photo/:pId", photoProductController);

// filter products ↓
router.post("/product-filters", productFilterController);

// fetch product count ↓
router.get("/product-count", productCountController);

// fetch product per page ↓
router.get("/product-list/:page", productListController);

// fetch products by search
router.get("/search/:keyword", searchProductController);

// fetch similar products
router.get("/similar-product/:pId/:cId", similarProductController);

// fetch category wise products
router.get("/product-category/:slug", productCategoryController);

// payment's routes
// first we'll fetch token
router.get("/braintree/token", braintreeTokenController);

// for payments
router.post("/braintree/payment", requireSignIn, braintreePaymentsController);

export default router;
