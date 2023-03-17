const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, unique:true},
    discription: {type: String, required: true},
    categories: {type: Array},
    size: {type: String},
    color: {type: String},
    price: {type: Number, required: true}
},
{timestamps: true}
);

module.exports = mongoose.model('Product', productSchema);