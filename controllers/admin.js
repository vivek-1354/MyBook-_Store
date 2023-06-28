const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn

  });
};

exports.postAddProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const proId = req.params.productId;
  Product.findById(proId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn

      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;

 Product.findById(prodId).then(product =>{
  product.title = updatedTitle,
  product.price = updatedPrice,
  product.imageUrl = updatedImageUrl,
  product.description = updatedDesc

  return product
    .save()
    .then((result) => {
      console.log("Product Updated...");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
 })
};

exports.getProducts = (req, res, next) => {
  Product.find()
  // .select('title imageUrl ')   // for selecting specific field like title and imageUrl from document
    // .populate('userId')
    .then((products) => {
      // console.log(products)
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn

      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then((ele) => {
      console.log("Item deleted...");
    })
    .catch((err) => {
      console.log("Item not Found for delete.");
    });
  res.redirect("/admin/products");
};
