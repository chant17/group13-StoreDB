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
var parseForm = bodyParser.urlencoded({
  extended: true
});
customerRouter.use(cookieParser());

//SQL Pool

customerRouter.get("/signup", (req, res, next) => {
  res.render('user/signup', {});
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
  if (!firstname || !lastname || !email || !username || !password || !password2 || !phone || !address1 || !city || !state || !zip || !country) {
    errors.push({
      msg: 'Please fill in all required fields'
    });
  }

  // Check passwords match
  if (password !== password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({
      msg: 'Password should be at least 6 characters'
    });
  }

  if (errors.length > 0) {
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
      if (err || data[0].cnt > 0) {
        console.log('User email already exists in database', err); // log error for dev
        res.render('user/signup', {
          data: 'Failed to create new user'
        })
      } else {
        let insertUser = 'INSERT INTO customer (membership_ID, username, first_name, last_name, email, phone_number, address1, address2, city, state, zip_code, country) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        let userID = makeid(5);
        db.query(insertUser, [userID, username, firstname, lastname, email, phone, address1, address2, city, state, zip, country], (err, result, fields) => {
          if (err) {
            console.log('Failed to insert new customer', err);
          } else {
            async function hashPassword(password) {
              const saltRounds = 10;
              const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                  if(err) reject(err);
                  resolve(hash);
                });
              });
              db.query("UPDATE `woivccvvos2pfj3e`.`customer` SET `password` = '"+hashedPassword+"' WHERE (`membership_ID` = '"+userID+"');");
              console.log('Did the Update query run?');
            };
            hashPassword(password);
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

customerRouter.get("/profile", (req, res) => {
  let sql = "select * from customer where membership_ID = 7";
  db.query(sql, (err, result, fields) => {
    res.render('user/profile', {
      data: result
    });
  });

});

customerRouter.post("/profilePost", parseForm, (req, res) => {
  let fname = req.body.fname;
  let lname = req.body.lname;
  let uname = req.body.uname;
  let city = req.body.city;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;
  let state = req.body.state
  let zip = req.body.zip;
  console.log(fname, lname, uname, city, phoneNumber, email, state, zip);
  let sql = "UPDATE customer SET first_name = ?, last_name = ?, username = ?, city = ?, phone_number = ?, email = ? , state = ?, zip_code=? WHERE membership_ID = 7";
  db.query(sql, [fname, lname, uname, city, phoneNumber, email, state, zip], (err, result, fields) => {
    if (err) {
      console.log(err);
    }
    res.redirect("profile");
  });
});

customerRouter.get("/changePassword/:id", (req, res, next) => {
  let id = req.params.id;
  let sql = "select count(password) from customer where password = ";
  res.render('user/passwordChange', {
    data: id
  });
});
customerRouter.post("/submitPassword/:id", parseForm, (req, res, next) => {
  let id = req.params.id;
  let sql = "select password from customer where membership_ID = ?";
  let oldPass = req.body.oldPass;
  let newPass1 = req.body.newPass1;
  let newPass2 = req.body.newPass2;
  console.log(oldPass + " " + newPass1 + " " + newPass2);
  db.query(sql, [id], (err, result, fields) => {
    if (err) {
      console.log(err);
    }
    if (oldPass === result[0].password) {
      let q = "UPDATE customer set password = ? WHERE membership_ID = ?";
      if (newPass1 === newPass2) {
        db.query(q, [newPass1, id], (err, result, fields) => {
          if (err) console.log(err);
          res.render('user/passwordRes', {
            data: 2
          });
        });
      } else {
        res.render('user/passwordRes', {
          data: 1
        });
      }
    } else {
      res.render('user/passwordRes', {
        data: 1
      });
    }

  });


});
module.exports = customerRouter;