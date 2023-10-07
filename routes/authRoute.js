import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPassController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// creating router object
const router = express.Router();

//Routing
// Register || Method- POST
router.post("/signup", registerController);

// LOGIN || Method- POST
router.post("/login", loginController);

// Forgot Password || Method - POST
router.post("/forgot-password", forgotPassController);

// test Routes || Method - GET
router.get("/test", requireSignIn, isAdmin, testController);

// protected Route auth (dashboard user) || Method - GET
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// update profile || Method - PUT
router.put("/profile", requireSignIn, updateProfileController);

// protected Route auth (dashboard Admin) || Method - GET
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// Orders || Method - GET
router.get("/orders", requireSignIn, getOrdersController);

//All Orders|| Method - GET
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// Update Order Status || Method - PUT
router.put("/order-status/:orderId", requireSignIn, isAdmin, orderStatusController);


export default router;
