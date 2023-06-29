const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = Schema({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true.isRequired,
      ref: "User",
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
