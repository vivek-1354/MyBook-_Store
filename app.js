const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const mongoConnect = require("./util/database").mongoConnect;

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6495e8c8a1d4c87b781b3d85")
    .then((user) => {
      req.user = user
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://testUser:et9vEiaZldFyRHPV@cluster0.aofa9mr.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then(user => {
      if (!user){
        const user = new User({
          name: 'vivek',
          email: 'vgupta9691@gmail.com',
          cart: {
            items: []
          }
        });
        user.save()
      }
    });
    app.listen(3000);
    console.log("Connected...")
    console.log("App running on " + "http://localhost:3000")
  })
  .catch((err) => {
    console.log(err);
  });
