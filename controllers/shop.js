const fs = require("fs");
const path = require("path");
const stripe = require("stripe")('sk_test_51NdVSoSD7li1j5yeBhIMB2wfNeD4Z3FZK5Z7Iu27sRE4W6sNAf0hyYcEi320FtBp4qLnro7fuVp5bxvGssnua50c00X1476hQT');

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage : page + 1,
        previousPage: page-1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage : page + 1,
        previousPage: page-1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        // isAuthenticated: req.session.isLoggedIn,
        // csrfToken: req.csrfToken(),
        // user: req.session.isLoggedIn ? req.session.user.email.split('.')[0] : ''
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      // console.log(user.cart.items)
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        prods: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      // console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeItemFromCart(prodId)
    .then((ele) => console.log("Item deleted"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  res.redirect("/cart");
};


exports.getCheckout = (req,res, next) => {
  let products;
  let total = 0;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      })
      
      // 
      // const session = stripe.checkout.sessions.create({
      //   payment_method_types: ['card'],
      //   line_items: products.map(product => ({
      //     price: product.priceId, // Stripe Price ID
      //     quantity: product.quantity,
      //   })),
      //   mode: 'payment',
      //   success_url: 'https://yourwebsite.com/success',
      //   cancel_url: 'https://yourwebsite.com/cancel',
      // });
  
      // res.json({ sessionId: session.id });

      // const lineItems =  products.map(p => {
      //   return {
      //     // name: p.productId.title,
      //     // description: p.productId.description,
      //     price: stripe.prices.create({
      //       product: p.productId,  // product.id,
      //       unit_amount: 2000,
      //       currency: 'usd',
      //     }).id,
      //     // currency: 'usd',
      //     quantity: p.quantity
      //   }
      // })

      // price_data: {
      //   currency: 'usd',
      //   unit_amount: 2000,
      //   product_data: {
      //     name: 'T-shirt',
      //     description: 'Comfortable cotton t-shirt',
      //     images: ['https://example.com/t-shirt.png'],
      //   },
      // },
      return stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: products.map(p => {
            return {
              price_data :{
                currency: 'inr',
                unit_amount: p.productId.price * 100,
                product_data: {
                  name: p.productId.title,
                  description: p.productId.description,
                }
              },
              quantity: p.quantity
            }
          }),
          mode: 'payment',
          success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // http://localhost:3000
          cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel', // http://localhost:3000
      })
    })
    .then(session => {
      res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout",
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
}
exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id }).then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found..."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized.."));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename "' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      pdfDoc.text("----------------------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "Rs " +
              prod.product.price
          );
      });
      // pdfDoc.text("Hello world!")

      pdfDoc.text("---------------------------------------");
      pdfDoc.text("Total: Rs " + totalPrice);
      pdfDoc.end();

      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename "' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });

      //   const file = fs.createReadStream(invoicePath)
      //     res.setHeader('Content-Type', 'application/pdf');
      //     res.setHeader(
      //       'Content-Disposition',
      //       'inline; filename="' + invoiceName + '"'
      //     );
      //     file.pipe(res)
    })
    .catch((err) => {
      next(err);
    });
};
