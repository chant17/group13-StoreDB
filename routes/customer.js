// Handle all customer related routes
const express = require("express");
const customerRouter = express.Router();
const db = require("../config/db");
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var session = require('express-session');


//Router Middleware
var csrfProtection = csrf({
  cookie: true
});
var parseForm = bodyParser.urlencoded({
  extended: false
});

customerRouter.use(cookieParser());
customerRouter.use(csrfProtection);

//SQL Pool

customerRouter.get("/signup", csrfProtection, (req, res, next) => {
  res.render('user/signup', {
    csrfToken: req.csrfToken()
  });
});

customerRouter.post('/signup', parseForm, csrfProtection, (req, res, next) => {
  res.redirect('/');
});

customerRouter.get("/signin", (req, res) => {
  res.render('user/signin');
});


// Custom sql param request via the http param
// Handling post request
customerRouter.post("/user_create", (req, res) => {
  console.log("trying to create a new user..");
  const fName = req.body.createFirstName;
  const lName = req.body.createLastName;
  const queryString =
    "INSERT INTO customer (first_name, last_name, membership_ID, FK_customer_cart) VALUES (?, ?, 12343, 0)";
  db.query(queryString, [fName, lName], (err, result, fields) => {
    if (err) {
      console.log("Failed to append user: " + err);
      res.sendStatus(500);
      return;
    }

    console.log("Inserted a new user with id: ", result.insertedId);
  });
});

module.exports = customerRouter;