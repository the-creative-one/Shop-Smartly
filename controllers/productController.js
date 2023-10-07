import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import slugify from "slugify";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

// configure env
dotenv.config(); //using this config because the env file was throwing error (or it wasn't getting recognized)
//if the env file is in other folder then we have to write as- dotenv.config({path:'here we've to write the path were the file is.'})

// braintree payment gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// create product controller
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validations
    switch (true) {
      case !name:
        return res.status(400).send({ error: "Name is required" });
      case !description:
        return res.status(400).send({ error: "Description is required" });
      case !price:
        return res.status(400).send({ error: "Price is required" });
      case !category:
        return res.status(400).send({ error: "Category is required" });
      case !quantity:
        return res.status(400).send({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.status(400).send({ error: "Upload a Photo of max 10mb" });
    }

    // to save the file
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    // validate photo
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating Product",
      error,
    });
  }
};

// to fetch all products
export const allProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalProducts: products.length,
      message: "All Products fetched Successfully ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while fetching Products",
      error: error.message,
    });
  }
};

// to fetch single product
export const singleProductController = async (req, res) => {
  try {
    const products = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Fetched the Product successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching the product",
      error,
    });
  }
};

// to fetch photo
export const photoProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pId).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching photo",
      error,
    });
  }
};

// to delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pId).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product has been Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting",
      error,
    });
  }
};

// to update product
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // validations
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is required" });
      case !description:
        return res.status(500).send({ error: "Description is required" });
      case !price:
        return res.status(500).send({ error: "Price is required" });
      case !category:
        return res.status(500).send({ error: "Category is required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is required" });
      case photo && photo.size > 100000:
        return res.status(500).send({ error: "Upload a Photo of max 1mb" });
    }

    // to save the file
    const products = await productModel.findByIdAndUpdate(
      req.params.pId,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    // validate photo
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating Product",
      error,
    });
  }
};

// to filter products
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    // create a query
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while Filtering Products",
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in fetching the data",
      error,
    });
  }
};

// product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? parseInt(req.params.page) : 1;
    const skip = (page - 1) * perPage;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in fetching the data",
      error,
    });
  }
};

// search product with search bar
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "505 - Server Error",
      error,
    });
  }
};

// to fetch similar products
export const similarProductController = async (req, res) => {
  try {
    const { pId, cId } = req.params;
    const products = await productModel
      .find({
        category: cId,
        _id: { $ne: pId },
      })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while fetching data",
      error,
    });
  }
};

// to fetch products category wise
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching products",
      error,
    });
  }
};

// payment gateway API ↓

// for token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// for payments
export const braintreePaymentsController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
};
