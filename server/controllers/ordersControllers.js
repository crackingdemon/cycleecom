const Order = require('../models/Order')

//CREATE
exports.createOrder =  async (req, res) => {
    const newOrder = new Order(req.body);
  
    try {
      const savedOrder = await newOrder.save();
      res.status(200).send(savedOrder);
    } catch (err) {
      res.status(500).send(err);
    }
  };

// update 
exports.updateOrder =  async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedOrder);
    } catch (err) {
      res.status(500).send(err);
    }
  };

// delete 
exports.deleteOrder =  async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).send("Order has been deleted...");
    } catch (err) {
      res.status(500).send(err);
    }
  };

// get user order 
exports.getUserOrder = async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.status(200).send(orders);
    } catch (err) {
      res.status(500).send(err);
    }
  };

// get all 
exports.getallOrder =  async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).send(orders);
    } catch (err) {
      res.status(500).send(err);
    }
  };

// get monthly income 
exports.getmothlyIncome =  async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).send(income);
    } catch (err) {
      res.status(500).send(err);
    }
  }