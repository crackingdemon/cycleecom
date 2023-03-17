const User = require('../models/User')
const bcrypt = require("bcrypt");


// update
exports.updateUser = async (req, res) => {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
  
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updateUser);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }


// delete 
exports.deleteUser = async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).send("user has been deleted...");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }


// get all user 
exports.getallUser = async (req, res) => {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(3)
        : await User.find();
  
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

// get user stats
exports.getuserStats = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }