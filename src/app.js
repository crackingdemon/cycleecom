import express from "express";
import cookieParser from "cookie-parser";
import AuthHandler from "./utils/auth/authHandler.js";
import Fetcher from "./utils/fetcher/index.js";
import CosmicFetch from "./utils/fetcher/cosmic.js";
import path from "path";
import { fileURLToPath } from "url";
import Home from "./utils/handlers/home.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/../public"));
app.set("view engine", "ejs");

const port = process.env.PORT || 8000;

app.get("/", async (req, res) => {
  let products = await Home.homeDataHandler();
  res.render("home", { products });
});




app.get("/login", async (req, res) => {
  res.render("boilerplate/login");
});
app.get("/profile", async (req, res) => {
  res.render("boilerplate/profile");
});
app.get("/about", async (req, res) => {
  res.render("boilerplate/about");
});

app.get("/allproduct", async (req, res) => {
  res.render("boilerplate/allproducts");
});
app.get("/register", (req, res) => {
  res.render("boilerplate/register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const response = await AuthHandler.register(name, email, password);
  if (response.status) {
    res.cookie("token", response.token, { maxAge: 1000 * 60 * 60 * 4 });
  }
  return res.json({
    ...response,
    message: response.status
      ? "User registered successfully"
      : "User registration failed",
    redirect: response.status ? "/" : "/register",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const response = await AuthHandler.verifyLogin(email, password);
  if (response.status) {
    res.cookie("token", response.token, { maxAge: 1000 * 60 * 60 * 4 });
  }
  return res.json({
    ...response,
    message: response.status ? "Login successfully" : "Login failed",
    redirect: response.status ? "/" : "/login",
  });
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.json({
    status: true,
    message: "Logout successfully",
    redirect: "/",
  });
});

app.post("/fetchcart", AuthHandler.verifyToken, async (req, res) => {
  const user = req.user;
  const _cart = await Fetcher.fetchCart(user.id);
  const productIds = _cart.data.map((product) => product.productId);
  const products = await CosmicFetch.fetchCartProducts(productIds);
  console.log(products);
  return products;
});

app.post("/addtocart", AuthHandler.verifyToken, async (req, res) => {
  const user = req.user;
  const { productId, quantity } = req.query;
  const response = await Fetcher.addToCart(user.id, productId, parseInt(quantity));
  return res.json({
    status: response.status,
    message: response.message,
  });
});

app.post("/removefromcart", AuthHandler.verifyToken, async (req, res) => {
  const user = req.user;
  const { productId } = req.body;
  return await Fetcher.removeFromCart(user.id, productId);
});

app.get("/cart", AuthHandler.verifyToken, async (req, res) => {
  const user = req.user;
  const _cart = await Fetcher.fetchCart(user.id);
  console.log(_cart);
  res.render("cart", { cart: _cart });
});

app.get("/product/:slug", async (req, res) => {
  const { slug } = req.params;
  const product = await Fetcher.fetchProduct(slug);
  console.log(product);
  res.render("products", { product: product.data });
});

app.get("/build", async (req, res) => {
  let data = await Home.migrateProducts();
  return res.send({ status: true, data });
});

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
