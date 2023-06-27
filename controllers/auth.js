exports.getLogin = (req, res, next) => {
      res.render("auth/login", {
        path: "/auth/login",
        pageTitle: "Login"
      });
  };