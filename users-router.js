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

let allResJSONData = [];

// get home page
router.get("/", users);

router.get("/:id", findUser);

router.post("/", addUser);

function users(req, res) {
  let db = req.app.locals.db;
  console.log(db);
  db.all("SELECT * FROM users", (err, rows) => {
    res.render("users", { users: rows });
  });
}

function findUser(req, res) {
  let userId = req.params.id;
  let db = req.app.locals.db;

  db.get("SELECT * FROM users WHERE userID = ?", [userId], (err, row) => {
    res.render("user", { user: row });
  });
}

function addUser(req, res) {
  let db = req.app.locals.db;

  let addition = req.body;
  let keys = JSON.stringify(Object.keys(addition));
  let values = Object.values(addition);

  // make sure values are valid
  if (keys.includes("userName")) {
    const insertProduct = db.prepare(
      "INSERT OR IGNORE INTO users (userName) VALUES (?)",
    );
    insertProduct.run(values[0]);

    res.status(200).end();
  }
}

//Export the router object
module.exports = router;
