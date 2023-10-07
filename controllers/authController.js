import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, question } = req.body;
    // validations check
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone Number is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!question) {
      return res.send({ message: "Answer is Required" });
    }

    //  check user
    const existingUser = await userModel.findOne({ email });
    // existing user check
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Email is already registered",
      });
    }

    // //  check user
    // const existingUser = await userModel.findOne({ });
    // // existing user check
    // if (existingUser) {
    //   return res.status(200).send({
    //     success: false,
    //     message: "Email is already registered",
    //   });
    // }

    // register User
    const hashedPassword = await hashPassword(password);
    // to save
    const newUser = await new userModel({
      name,
      email,
      phone,
      address,
      question,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Register Successfully",
      newUser,
    });
  } catch (message) {
    console.log(message);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      message,
    });
  }
};

// POST Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email and Password !",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email Not Found!",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Wrong Password! Try Again.",
      });
    }

    // for token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successful!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (message) {
    console.log(message);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      message,
    });
  }
};

// forgot password

export const forgotPassController = async (req, res) => {
  try {
    const { email, question, newPass } = req.body;
    if (!email) {
      res.status(200).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!question) {
      res.status(200).send({
        success: false,
        message: "Answer is required",
      });
    }
    if (!newPass) {
      res.status(200).send({
        success: false,
        message: "New Password is required",
      });
    }

    // checking
    const user = await userModel.findOne({ email, question });
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Incorrect Answer",
      });
    }

    // hash password
    const hashed = await hashPassword(newPass);

    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password has been updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

// test controller
export const testController = (req, res) => {
  res.send("protected route");
};

// to update Profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);
    // to check password
    if (password && password.length < 5) {
      return res.json({ error: "More than 5 character Password is required" });
    }
    // to hash the password
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user?.name,
        password: hashedPassword || user?.password,
        phone: phone || user?.phone,
        address: address || user?.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully!",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

// for all orders

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "internal Server Error ",
      error,
    });
  }
};

// for orders

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "internal Server Error ",
      error,
    });
  }
};


// for updating order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updateOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(updateOrder);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};


