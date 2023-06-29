const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('=')[1]
  let message = req.flash('error')
  if (message.length > 0){
      message = message[0]
  } else {
    message = null
  }
  res.render("auth/login", {
    path: "/auth/login",
    pageTitle: "Login",
    errorMessage: message,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email})
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or Password')
        return res.redirect("/login");
      }
      bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        }
        req.flash('error', 'Invalid email or Password')
        res.redirect("/login");
      })
      .catch((err) => {
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
  });
  res.redirect("/");
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0){
      message = message[0]
  } else {
    message = null
  }
  res.render("auth/signup", {
    path: "/auth/signup",
    pageTitle: "SignUp",
    isAuthenticated: false,
    errorMessage : message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  
  User.findOne({ email: email })
  .then((userDoc) => {
    if (userDoc) {
      req.flash('error', 'E-Mail exists already, please pick a different email.')
      // console.log("User already registered.");
      return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
