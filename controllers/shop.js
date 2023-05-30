const Product = require("../models/product");
const CartItem = require("../models/cart-item");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
  // Product.findByPk(prodId)
  // .then((product) => {
  //   res.render('shop/product-detail', {
  //     product: product,
  //     pageTitle: product.title,
  //     path: '/products'
  //   });

  // })
  // .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            prods: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
  // Cart.getMyCart(cart =>{
  //   Product.findAll(products => {
  //     const cartProducts = [];
  //     for (let product of products){
  //       const cartProductData =cart.products.find(prod => prod.id === product.id)
  //       if (cartProductData){
  //         cartProducts.push({productData: product, qty: cartProductData.qty});
  //       }
  //     }
  //   })
  // })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;

      if (products.length > 0) {
        product = products[0];
      }
      let newQuantity = 1;
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return fetchCart.addProduct(product, {
          through: {
            quantity: newQuantity,
          },
        });
      }
      return Product.findByPk(prodId)
        .then((product) => {
          return fetchCart.addProduct(product, {
            through: { quantity: newQuantity },
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((err) => console.log(err));
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  CartItem.destroy({ where: { productId: prodId } })
    .then((ele) => console.log("Item deleted"))
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/cart");
};

exports.postOrder = (req, res, next) => {
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      return fetchCart.setProducts(null)
    })
    .then(result => {
      res.redirect("/orders");

    })
    .catch(err =>{
      console.log(err)
    })
};
exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders
    });
  })
};
