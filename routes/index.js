const express = require("express");
const router = express.Router();
const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'dw4h1mb7skn1bu0n',
  password: 'z31mjqf5qy22tlbm',
  database: 'woivccvvos2pfj3e',
});

connection.connect((error) => {
  if(!!error) {
    console.log('Error');
  } else {
    console.log('Connected to heroku database');
  }
});

router.get("/", (req, res) => {
  res.render("layouts/layout");
  connection.query(mytestquery, (error, rows, fields) => {
    if(!!error) {
      console.log('Query Failed');
    } else {
      console.log('Successful Query');
    }
  })
});

module.exports = router;