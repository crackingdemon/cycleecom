const express = require("express");
  const router = express.Router();
  const { verifyToken } = require("../middleware/verifyToken");
  const {
    verifyTokenAndAuthorisation,
  } = require("../middleware/verifyTokenAndAuthorisation");
  const { verifyTokenAndAdmin } = require("../middleware/verifyTokenAndAdmin");
  const cartControllers = require("../controllers/cartsControllers");

//CREATE

router.post("/addtocart", verifyToken, cartControllers.createCart);
  
  //UPDATE
  router.put("/:id", verifyTokenAndAuthorisation, cartControllers.updateCart);
  
  //DELETE
  router.delete("/:id", verifyTokenAndAuthorisation, cartControllers.cartremove);
  
  //GET USER CART
  router.get("/find/:userId", verifyTokenAndAuthorisation, cartControllers.getUserCart);
  
  // //GET ALL
  
  router.get("/", verifyTokenAndAdmin, cartControllers.getallCart);
  
  module.exports = router;