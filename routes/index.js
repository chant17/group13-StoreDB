const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const db = require("../config/db");

router.get("/", (req, res) => {
  res.render("layouts/layout");
  db.query(mytestquery, (error, rows, fields) => {
    if(!!error) {
      console.log('Query Failed');
    } else {
      console.log('Successful Query');
    }
  })
});

module.exports = router;