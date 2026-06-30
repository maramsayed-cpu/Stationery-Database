

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

// create the router
let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let allResJSONData = [];

// get home page
router.get("/", products);

router.get("/:id", findProduct);

router.post("/", addProduct);

router.post("/likeProduct", likeProduct);

router.post("/reviewProduct", reviewProduct);

router.post("/filter", filterProducts);

function products(req, res) {
  let db = req.app.locals.db;
  console.log(db);
  db.all("SELECT * FROM products", (err, rows1) => {
    db.all("SELECT shopName FROM shops", (err, rows2) => {
      db.all("SELECT userID FROM users", (err, rows3) => {
        console.log(rows1, rows2, rows3);
        res.render("products", {
          products: rows1,
          shops: rows2,
          users: rows3,
        });
      });
    });
  });
}

function findProduct(req, res) {
  let productId = req.params.id;
  let db = req.app.locals.db;

  db.get(
    "SELECT * FROM products WHERE productID = ?",
    [productId],
    (err, row1) => {
      db.get(
        "SELECT shopName FROM made_by WHERE productID = ?",
        [productId],
        (err, row2) => {
          db.all(
            "SELECT * FROM (reviewed_by JOIN users ON reviewed_by.userID = users.userID) WHERE productID = ?",
            [productId],
            (err, row3) => {
              db.get(
                "SELECT COUNT(*) FROM liked_by WHERE productID = ?",
                [productId],
                (err, row4) => {
                  res.render("product", {
                    product: row1,
                    shopName: row2["shopName"],
                    reviews: row3,
                    likes: row4["COUNT(*)"],
                  });
                },
              );
            },
          );
        },
      );
    },
  );
}

function addProduct(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;
  let keys = JSON.stringify(Object.keys(addition));
  let values = Object.values(addition);

  // make sure values are valid
  if (
    keys.includes("name") &&
    keys.includes("price") &&
    keys.includes("type") &&
    keys.includes("shopName") &&
    !isNaN(values[1])
  ) {
    const insertProduct = db.prepare(
      "INSERT OR IGNORE INTO products (productName, price, type) VALUES (?, ?, ?)",
    );
    insertProduct.run(values[0], values[1], values[2]);

    const insertShop = db.prepare(
      "INSERT OR IGNORE INTO shops (shopName, artistName, basedIn ) VALUES (?, ?, ?)",
    );
    insertShop.run(values[4], values[7], values[8]);

    if (values[3] == "online") {
      const insertOnline = db.prepare(
        "INSERT OR IGNORE INTO online_shops (shopName, siteName, shopURL) VALUES (?, ?, ?)",
      );
      insertOnline.run(values[4], values[5], values[6]);
    } else {
      const insertInPerson = db.prepare(
        "INSERT OR IGNORE INTO in_pers_shops (shopName, storeName, storeAddress) VALUES (?, ?, ?)",
      );
      insertInPerson.run(values[4], values[5], values[6]);
    }

    db.get(
      "SELECT * FROM products WHERE productName = ? AND price = ? AND type = ?",
      [values[0], values[1], values[2]],
      (err, row) => {
        const insertMadeBy = db.prepare(
          "INSERT OR IGNORE INTO made_by (productID, shopName) VALUES (?, ?)",
        );
        insertMadeBy.run(row.productID, values[4]);

        const insertUser = db.prepare(
          "INSERT OR IGNORE INTO uploaded_by (productID, userID) VALUES (?, ?)",
        );
        insertUser.run(row.productID, addition.userID);
        res.status(200).json(row);
      },
    );
  }
}

function likeProduct(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;
  let keys = JSON.stringify(Object.keys(addition));
  let values = Object.values(addition);

  // make sure values are valid
  if (keys.includes("userID") && keys.includes("productID")) {
    const insertProduct = db.prepare(
      "INSERT OR IGNORE INTO liked_by (productID, userID) VALUES (?, ?)",
    );
    insertProduct.run(addition.productID, addition.userID);

    db.get(
      "SELECT COUNT(*) FROM liked_by WHERE productID = ?",
      [addition.productID],
      (err, row1) => {
        db.get(
          "SELECT * FROM products WHERE productID = ?",
          [addition.productID],
          (err, row2) => {
            console.log(row1, row2);
            res.status(200).json({ product: row2, likes: row1["COUNT(*)"] });
          },
        );
      },
    );
  } else {
    console.log("hello");
  }
}

function reviewProduct(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;
  let keys = JSON.stringify(Object.keys(addition));
  let values = Object.values(addition);

  // make sure values are valid
  if (
    keys.includes("userID") &&
    keys.includes("productID") &&
    keys.includes("rating") &&
    keys.includes("reviewComment")
  ) {
    const insertProduct = db.prepare(
      "INSERT OR IGNORE INTO reviewed_by (userID, productID, rating, reviewComment) VALUES (?, ?, ?, ?)",
    );
    insertProduct.run(
      addition.userID,
      addition.productID,
      addition.rating,
      addition.reviewComment,
    );
    res.status(200).json({ id: addition.productID });
  } else {
    console.log("hello");
  }
}

function filterProducts(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;

  // make sure values are valid
  if (addition.filterType && addition.filterResult) {
    console.log(addition);
    if (addition.filterType == "ProductType") {
      db.all(
        "SELECT * FROM products WHERE type = ?",
        [addition.filterResult],
        (err, row1) => {
          console.log(row1);
          res.status(200).json({ products: row1 });
        },
      );
    } else if (addition.filterType == "MyLikes") {
      db.all(
        "SELECT * FROM (products JOIN liked_by ON products.productID = liked_by.productID) WHERE userID = ?",
        [addition.filterResult],
        (err, row1) => {
          console.log(row1);
          res.status(200).json({ products: row1 });
        },
      );
    } else if (addition.filterType == "ShopName") {
      db.all(
        "SELECT * FROM (products JOIN made_by ON products.productID = made_by.productID) WHERE shopName = ?",
        [addition.filterResult],
        (err, row1) => {
          console.log(row1);
          res.status(200).json({ products: row1 });
        },
      );
    }
  } else {
    db.all("SELECT * FROM products", (err, row1) => {
      console.log(row1);
      res.status(200).json({ products: row1 });
    });
  }
}

//Export the router object
module.exports = router;
