const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAuthorisation,
} = require("../middleware/verifyTokenAndAuthorisation");
const { verifyTokenAndAdmin } = require("../middleware/verifyTokenAndAdmin");
const userController = require("../controllers/usersControllers");

// update
router.put("/:id", verifyTokenAndAuthorisation, userController.updateUser);

// delete
router.delete("/:id", verifyTokenAndAuthorisation, userController.deleteUser);

// get all user
router.get("/", verifyTokenAndAdmin, userController.getallUser);

// get user stats
router.get("/stats", verifyTokenAndAdmin, userController.getuserStats);

module.exports = router;