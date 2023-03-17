const mongoose = require("mongoose");

const deleverySchema = new mongoose.Schema(
  {
    Adress: { type: String, required:true},
    Phone_number:{type:String, required:true}
  }
);

module.exports = mongoose.model("DeleveryOrder", deleverySchema);