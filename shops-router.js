/*

  Student Name: Maram Sayed
  Student #: 101304334

*/

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

// create the router
let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// get home page
router.get("/", shops);

router.get("/:name", findShop);

router.post("/", addShop);

router.post("/filter", filterShops);

function shops(req, res) {
  let db = req.app.locals.db;
  db.all("SELECT * FROM shops", (err, rows) => {
    res.render("shops", { shops: rows });
  });
}

function findShop(req, res) {
  let shopName = req.params.name;
  let db = req.app.locals.db;

  db.get("SELECT * FROM shops WHERE shopName = ?", [shopName], (err, row1) => {
    db.get(
      "SELECT shopURL FROM ONLINE_SHOPS WHERE shopName = ?",
      [shopName],
      (err, row2) => {
        db.all(
          "SELECT storeName, storeAddress FROM IN_PERS_SHOPS WHERE shopName = ?",
          [shopName],
          (err, row3) => {
            db.all(
              "SELECT * FROM (made_by JOIN products ON made_by.productID = products.productID) WHERE shopName = ?",
              [shopName],
              (err, row4) => {
                console.log(row4);
                res.render("shop", {
                  shop: row1,
                  links: row2,
                  stores: row3,
                  products: row4,
                });
              },
            );
          },
        );
      },
    );
  });
}

function addShop(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;
  let keys = JSON.stringify(Object.keys(addition));
  let values = Object.values(addition);

  // make sure values are valid
  if (
    keys.includes("shopName") &&
    keys.includes("basedIn") &&
    keys.includes("artistName") &&
    keys.includes("shopURL") &&
    keys.includes("siteName")
  ) {
    const insertShop = db.prepare(
      "INSERT OR IGNORE INTO shops (shopName, artistName, basedIn) VALUES (?, ?, ?)",
    );
    insertShop.run(values[0], values[1], values[2]);

    const insertOnlineShop = db.prepare(
      "INSERT OR IGNORE INTO online_shops (shopName, siteName, shopURL) VALUES (?, ?, ?)",
    );
    insertOnlineShop.run(values[0], values[3], values[4]);

    db.get(
      "SELECT * FROM shops WHERE shopName = ?",
      [values[0]],
      (err, row) => {
        res.status(200).json(row);
      },
    );
  }
}

function filterShops(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;

  // make sure values are valid
  if (addition.filterType && addition.filterResult) {
    if (addition.filterType == "Name") {
      db.all(
        "SELECT * FROM shops WHERE shopName = ?",
        [addition.filterResult],
        (err, row1) => {
          console.log(row1);
          res.status(200).json({ shops: row1 });
        },
      );
    }
  } else {
    db.all("SELECT * FROM shops", (err, row1) => {
      console.log(row1);
      res.status(200).json({ shops: row1 });
    });
  }
}

//Export the router object
module.exports = router;
