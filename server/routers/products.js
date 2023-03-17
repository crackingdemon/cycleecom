const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middleware/verifyTokenAndAdmin");
const productControllers = require("../controllers/productsControllers");

 
//CREATE

router.post("/", verifyTokenAndAdmin, productControllers.createProduct);
  
  //UPDATE
  router.put("/:id", verifyTokenAndAdmin, productControllers.updateProduct);
  
  //DELETE
  router.delete("/:id", verifyTokenAndAdmin, productControllers.deleteProduct);
  
  //GET PRODUCT
  router.get("/find/:id", productControllers.getProduct);
  
  //GET ALL PRODUCTS
  router.get("/", productControllers.getallProduct);
  
  module.exports = router;