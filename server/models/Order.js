const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    
    "id": String,
    "name": String,
    "price": Number,
    "description": String,
    "category": String,
    "slug": String,
    "image": Array,
    "Adress":String,
    "Phone Number":Number,
    "Adress":String
  }
);

module.exports = mongoose.model("Order", orderSchema);