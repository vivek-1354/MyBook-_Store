const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
  .then(result => {
  console.log("Product created.")
  res.redirect('/admin/products')
  })
  .catch(err => console.log(err))
};

// res.redirect("/");
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const proId = req.params.productId;
  req.user.getProducts({where: {id: proId}})
  .then(products => {
    const product = products[0]
    if (!product) {
      res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  }).catch(err => console.log(err))
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedPrice = req.body.price;

  Product.findByPk(prodId)
  .then(product => {
    product.title = updatedTitle,
    product.imageUrl = updatedImageUrl,
    product.price = updatedPrice,
    product.description = updatedDesc
    return product.save()
  })
  .then(result => {
    console.log("Product Updated...")
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.destroy({where :{
    id:prodId
  }})
  .then(ele =>{
    console.log("Item deleted...")
  })
  .catch(err => {
    console.log("Item not Found for delete.")
  });
  res.redirect("/admin/products");
};
