

const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this is for the script files for pug
app.use(express.static("public"));

const sqlite3 = require("sqlite3").verbose();
// Connect to a database file (creates it if it doesn't exist)
const db = new sqlite3.Database("./stationery.db");
app.locals.db = db;

db.serialize(() => {
  // set pug as our template engine
  app.set("view engine", "pug");
  app.set("views", "./views");

  let usersRouter = require("./users-router");
  app.use("/users", usersRouter);

  let shopsRouter = require("./shops-router");
  app.use("/shops", shopsRouter);

  let productsRouter = require("./products-router");
  app.use("/products", productsRouter);

  // get to home page
  app.get("/", (req, res) => {
    res.render("home");
  });

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.get("/addProduct", (req, res) => {
    res.render("addProduct");
  });

  app.get("/addShop", (req, res) => {
    res.render("addShop");
  });
});

app.listen(3005, () => {
  console.log("Server listening at http://localhost:3005");
});
