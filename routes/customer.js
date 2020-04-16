// Handle all customer related routes
const express = require("express");
const customerRouter = express.Router();
const mysql = require('mysql');
const db = require("../config/db");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');

//Router Middleware
var parseForm = bodyParser.urlencoded({ extended:true });
customerRouter.use(cookieParser());

//SQL Pool

customerRouter.get("/signup", (req, res, next) => {
  res.render('user/signup', {
  });
});

// temporary make id function
function makeid(length) {
  var result = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Register Handle
  customerRouter.post('/signup', parseForm, async (req, res, next) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let password2 = req.body.password2;
    let phone = req.body.phone;
    let address1 = req.body.address1;
    let address2 = req.body.address2;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let country = req.body.country;
    let errors = [];
    let hashedPassword = '';
    let sql = 'INSERT INTO customer (membership_ID)'
    console.log(req.body.firstname);
    console.log(req.body.lastname);
    console.log(req.body.email);
    console.log(req.body.username);
    console.log(req.body.password);
    console.log(req.body.password2);
    console.log(req.body.phone);
    console.log(req.body.address1);
    console.log(req.body.address2);
    console.log(req.body.city);
    console.log(req.body.state);
    console.log(req.body.zip);
    console.log(req.body.country);

  // Check Required Fields
    if(!firstname || !lastname || !email || !username || !password || !password2 || !phone || !address1 || !city || !state || !zip || !country ){
      errors.push({ msg: 'Please fill in all required fields'});
      console.log(errors.length);
    }

// Check passwords match
    if(password !== password2) {
      errors.push({ msg: 'Passwords do not match'} );
}

// Check password length
    if(password.length < 6) {
      errors.push({ msg: 'Password should be at least 6 characters'});
      console.log(errors.length);
}

    if(errors.length > 0) {
      res.render('user/signup', {
        errors,
        firstname,
        lastname,
        email,
        username,
        password,
        password2,
        phone,
        address1,
        city,
        state, 
        zip,
        country
      })
      } else {
        let checkExists = "SELECT COUNT(*) AS cnt FROM customer WHERE customer.email = ?";
        db.query(checkExists, [email], (err, data) => {
          if(err || data[0].cnt > 0) {
            console.log('User email already exists in database',err); // log error for dev
            res.render('user/signup', {
              data: 'Failed to create new user'
            })
          } else {
            let insertUser = 'INSERT INTO customer (membership_ID, username, first_name, last_name, email, phone_number, address1, address2, city, state, zip_code, country, password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
            let userID = makeid(5);
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                  throw err;
                } else {
                  
                }
              })
            })
            db.query(insertUser, [userID, username, firstname, lastname, email, phone, address1, address2, city, state, zip, country, hashedPassword], (err, result, fields) => {
              if(err) {
                console.log('Failed to insert new customer', err);
              } else {
                console.log('New customer added to db');
                res.render('user/signin');
              }
            })
          }
        })
      }
});
// Login Page
customerRouter.get("/signin", (req, res) => {
  res.render('user/signin');
});


module.exports = customerRouter;