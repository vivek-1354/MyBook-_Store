const mongoose = require("mongoose");

const Schema = mongoose.Schema

const productSchema = new Schema({
    title: {
      type: String,
      require: true
    },
    price: {
      type:Number,
      require: true
    },
    description: {
      type:String,
      require: true
    },
    imageUrl: {
      type: String,
      require: true
    },

})

module.exports = mongoose.model('Product', productSchema)

// class Product {
//   constructor(title, price, imageUrl, description, id, userId) {
//     (this.title = title),
//       (this.price = price),
//       (this.imageUrl = imageUrl),
//       (this.description = description),
//       (this._id = id),
//       (this.userId = userId);
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       // update the product
//       this._id = new mongodb.ObjectId(this._id);
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
//     } else {
//       // Add new product
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         // console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then(result => {
//         console.log("Item deleted...")
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
