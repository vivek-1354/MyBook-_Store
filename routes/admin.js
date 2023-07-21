const path = require("path");

const express = require("express");

const validator = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    validator.body("title").isString().isLength({ min: 3 }).trim(),
    // validator.body("imageUrl").isURL(),
    validator.body("price").isFloat(),
    validator.body("description").isLength({ min: 8, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    validator.body("title").isString().isLength({ min: 3 }).trim(),
    // validator.body("imageUrl").isURL(),
    validator.body("price").isFloat(),
    validator.body("description").isLength({ min: 8, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
