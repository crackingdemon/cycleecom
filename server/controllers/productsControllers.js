const Product = require("../models/Product");

//CREATE
exports.createProduct = async (req, res) => {
    const newProduct = new Product(req.body);
  
    try {
      const savedProduct = await newProduct.save();
      res.status(200).send(savedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
 
// update 
exports.updateProduct =  async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }

// delete 
exports.deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).send("Product has been deleted...");
    } catch (err) {
      res.status(500).send(err);
    }
  }

  //GET PRODUCT
  exports.getProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send(err);
    }
  }


  //GET ALL PRODUCTS
  exports.getallProduct =  async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(3);
      } else if (qCategory) {
        products = await Product.find({
          categories: {
            $in: [qCategory],
          },
        });
      } else {
        products = await Product.find();
      }
  
      res.status(200).send(products);
    } catch (err) {
      res.status(500).send(err);
    }
  }