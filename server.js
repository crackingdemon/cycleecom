const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs");
var products = JSON.parse(fs.readFileSync("./products.json", "utf8"));
const User = require('./server/models/User')
const Cart = require("./server/models/Cart");
const Order = require("./server/models/Order");
const Delevery = require('./server/models/Delevery');
const { validateHeaderValue } = require("http");

const cookieParser = require("cookie-parser");
app.use(cookieParser());


const prisma = require("./src/db/index");
// const cookieParser = require('cookie-parser')

const connectDB = require("./server/database/connection");
const userRoute = require("./server/routers/users");
const authRoute = require("./server/routers/auth");
const productRoute = require("./server/routers/products");
const cartRoute = require("./server/routers/carts");
const orderRoute = require("./server/routers/orders");
const error = require("./server/middleware/error");
const autho = require("./server/middleware/autho");
const adminAuth = require("./server/middleware/adminAuth");

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

const PORT = process.env.PORT || 8000;

// connecting database
connectDB();

app.get("/", async (req, res) => {
  const user_id = req.cookies.user_id;
  // let productsData = await prisma.Product.findMany();
  // console.log("products data is ", productsData);
  // let products = await productsData;
  var number_cart_item = await Cart.find({ user: user_id }).count();
  res.render("home", { products, number_cart_item });
});

app.get("/login", async (req, res) => {
  const user_id = req.cookies.user_id;
  if(user_id != undefined) {
    res.redirect("/")
    return;
  } 

    res.render("boilerplate/login");

});
app.get("/profile", async (req, res) => {
  res.render("boilerplate/profile");
});
app.get("/about", async (req, res) => {
  res.render("boilerplate/about");
});

app.get("/productdetail/:product_id", async (req, res) => {
  const product_id = req.params.product_id;
  let pro = products.find(({ id }) => id == product_id);
  res.render("products", { pro });
});

app.get("/allproduct", async (req, res) => {
  res.render("boilerplate/allproducts", { products });
});

app.get("/cart", autho, async (req, res) => {
  const user_id = req.cookies.user_id;
  var cart_item = await Cart.find({ user: user_id });
  var product = cart_item.map(function (elem) {
    return products.find(({ id }) => id == elem.product_Id);
  });

  res.render("cart", { product });
});

app.get("/addtocart", async (req, res) => {
  res.redirect("/cart");
});

app.get("/addtocart/:product_id", autho, async (req, res) => {
  const user_id = req.cookies.user_id;
  const product_id = req.params.product_id;

  const newData = new Cart({ user: user_id, product_Id: product_id });
  newData.save();

  if (req.xhr) {
    res.status(200).send({
      success: true,
    });
  } else {
      res.redirect("/cart"); 
  }
  // res.status(200).redirect('/cart');
});

app.get("/cartremove/:product_id", async (req, res) => {
  const user_id = req.cookies.user_id;

  var is_delete = await Cart.deleteOne({
    user: user_id,
    product_Id: req.params.product_id,
  });

  res.status(200).redirect("/addtocart");
});

app.get("/register", (req, res) => {
  res.render("boilerplate/register");
});

app.get("/admin",autho,adminAuth, async (req, res) => {

   
    let OrderProd = await Order.find()
    let totalUser = await User.find()
  
    res.render("admin", {OrderProd, totalUser});
 
 
});

app.get("/admin/order",autho, adminAuth, async (req, res) => {

  let OrderProd = await Order.find()

  res.render("boilerplate/adminorder", {OrderProd});
});

app.post("/ordersfull",autho, async (req, res) => {
    const delevery = new Delevery(req.body)
    await delevery.save();

    const user_id = req.cookies.user_id;
  var cart_item = await Cart.find({ user: user_id });
  var product = cart_item.map(function (elem) {
    return products.find(({ id }) => id == elem.product_Id);
  });
  const deleveryAdress = req.body.Adress;

  product.forEach((pro)=>{
    pro.Adress = deleveryAdress;
    Order.create(pro);
    
  })
 
  const date = new Date().toLocaleDateString()

  res.render("ordersfull", {product, deleveryAdress, date});
});

app.use("/", userRoute);
app.use("/", authRoute);
app.use("/", productRoute);
app.use("/", cartRoute);
app.use("/", orderRoute);
// app.use(error);

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
