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
  req.session.isLoggedIn = true
  res.redirect("/");
};
