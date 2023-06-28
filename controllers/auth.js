const User = require('../models/user')
exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1]
// console.log(req.get('Cookie'))
  res.render("auth/login", {
    path: "/auth/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
    User.findById("6495e8c8a1d4c87b781b3d85")
    .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
    })
    .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
   req.session.destroy((err) => {
      console.log(err)
   })
   res.redirect('/')
};
