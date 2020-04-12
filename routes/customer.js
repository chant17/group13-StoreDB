//Handle all customer related routes
const express = require("express");
const customerRouter = express.Router();
const mysql = require("mysql");
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var session = require('express-session');


//Router Middleware
var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

customerRouter.use(cookieParser());
customerRouter.use(csrfProtection);

//SQL Pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'dw4h1mb7skn1bu0n',
    password: 'z31mjqf5qy22tlbm',
    database: 'woivccvvos2pfj3e'
})

function getConnection() {
  return pool;
}

customerRouter.get("/signup", (req, res) => {
  res.render('user/signup');
});


//custom sql param request via the http param
//handling post request
customerRouter.post("/user_create", (req, res) => {
  console.log("trying to create a new user..");
  const fName = req.body.createFirstName;
  const lName = req.body.createLastName;
  const queryString =
    "INSERT INTO customer (first_name, last_name, membership_ID, FK_customer_cart) VALUES (?, ?, 12343, 0)";
  getConnection().query(queryString, [fName, lName], (err, result, fields) => {
    if (err) {
      console.log("Failed to append user: " + err);
      res.sendStatus(500);
      return;
    }

    console.log("Inserted a new user with id: ", result.insertedId);
  });
});

module.exports = customerRouter;
