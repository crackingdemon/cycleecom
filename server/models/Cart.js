const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: String},
    product_Id:{type:String}
  }
);

module.exports = mongoose.model("Cart", cartSchema);