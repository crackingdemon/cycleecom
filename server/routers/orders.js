const express = require("express");
  const router = express.Router();
  const { verifyToken } = require("../middleware/verifyToken");
  const {
    verifyTokenAndAuthorisation,
  } = require("../middleware/verifyTokenAndAuthorisation");
  const { verifyTokenAndAdmin } = require("../middleware/verifyTokenAndAdmin");
  const orderControllers = require("../controllers/ordersControllers");

//CREATE

router.post("/", verifyToken, orderControllers.createOrder);
  
  //UPDATE
  router.put("/:id", verifyTokenAndAdmin, orderControllers.updateOrder);
  
  //DELETE
  router.delete("/:id", verifyTokenAndAdmin, orderControllers.deleteOrder);
  
  //GET USER ORDERS
  router.get("/find/:userId", verifyTokenAndAuthorisation, orderControllers.getUserOrder);
  
  // //GET ALL
  
  router.get("/", verifyTokenAndAdmin, orderControllers.getallOrder);
  
  // GET MONTHLY INCOME
  
  router.get("/income", verifyTokenAndAdmin, orderControllers.getmothlyIncome);
  
  module.exports = router;