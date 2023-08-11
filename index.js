const path = require("path");
// const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash")
const multer = require('multer')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
// const morgan = require('morgan')

const errorController = require("./controllers/error");

const User = require("./models/user");

const MONGODB_URI =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aofa9mr.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

app.use(cors())

const PORT = process.env.PORT || 3000

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, 'access.log'), 
//   { flags: 'a'}
// );

// app.use(helmet())   // adding some important headers to every request, response
app.use(compression())  // compress size of data and files but not image file
// app.use(morgan('combined', {stream: accessLogStream}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))
// app.use(multer({dest:"images"}).single('image'))
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
  );
  
  app.use(csrfProtection);
  app.use(flash())


  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error('dummy error')
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err))
    });
});


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500)

app.use(errorController.get404);

console.log(MONGODB_URI)
console.log(process.env.STRIPE_KEY)

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(PORT);
    console.log("Connected...");
  })
  .catch((err) => {
    console.log(err);
  });
