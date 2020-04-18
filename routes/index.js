const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const db = require("../config/db");

router.get("/", (req, res) => {
  res.render("layouts/layout");
});

module.exports = router;