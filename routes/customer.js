// Handle all customer related routes
const express = require("express");
const customerRouter = express.Router();
const db = require("../config/db");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

//Router Middleware 
var parseForm = bodyParser.urlencoded({
  extended: true
});
customerRouter.use(cookieParser());

//SQL Pool
customerRouter.get("/signup", (req, res, next) => {
  res.render('user/signup');
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

const redirectProfile = (req, res, next) => {
  if (req.session.loggedin) {
    res.redirect('/customer/profile/' + req.session.memID);
  } else {
    next();
  }
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
      country,
      login: req.session.loggedin,
      memID: req.session.memID,
      adminAccess: req.session.isAdmin
    })
  } else {
    let checkExists = "SELECT COUNT(*) AS cnt FROM customer WHERE customer.username = ?";
    db.query(checkExists, [username], async (err, data) => {
      if (err || data[0].cnt > 0) {
        console.log('Username already exists in database', err); // log error for dev
        res.render('user/signup', {
          data: 'Failed to create new user',
          login: req.session.loggedin,
          memID: req.session.memID,
          adminAccess: req.session.isAdmin
        })
      } else {
        let insertUser = 'INSERT INTO customer (username, first_name, last_name, email, phone_number, address1, address2, city, state, zip_code, country, password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        const hashedPassword = await bcrypt.hashSync(password, 10);
        console.log("here: " + hashedPassword + "| OG password: ", password, " | " + username);
        db.query(insertUser, [username, firstname, lastname, email, phone, address1, address2, city, state, zip, country, hashedPassword], (err, result, fields) => {
          if (err) {
            console.log('Failed to insert new customer', err);
            res.end();
          }
          console.log('New customer registered and added to database');

          res.render('user/signin', {
            login: req.session.loggedin,
            memID: req.session.memID,
            adminAccess: req.session.isAdmin
          });
        });
      }
    });
  }
});

// Login Page
customerRouter.get("/signin", redirectProfile, (req, res) => {
  res.render('user/signin', {
    login: req.session.loggedin,
    memID: req.session.memID,
    adminAccess: req.session.isAdmin
  });
});

customerRouter.post("/signin", parseForm, (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username);
  console.log(password);
  let sql = "SELECT count(*) as userCheck from customer where username = ?;";
  db.query(sql, [username], (err, result, fields) => {
    if (err) console.log("here 1 " + err);
    let userCheck = result[0].userCheck;
    console.log("USER CHECK is " + userCheck);
    if (userCheck === 1) {
      let passQ = "SELECT password, membership_ID FROM customer where username = ?;";
      db.query(passQ, [username], async (err, result, fields) => {
        if (err) console.log("here 2 " + err);
        const storedPassword = result[0].password;
        console.log("Password is: " + storedPassword);

        const memID = result[0].membership_ID;

        const validate = await bcrypt.compareSync(password, storedPassword);
        if (validate) {
          console.log('Successful Login - Session created.')
          req.session.loggedin = true;
          req.session.username = username;
          req.session.memID = memID;
          req.session.adminLogin = false;
          console.log("session username: " + req.session.memID);
          let checkAdmin = "select isAdmin from customer where username = ?";
          db.query(checkAdmin, [username], (err, result, fields) => {
            if (err) {
              console.log(err);
              res.send(500);
            }
            if (result[0].isAdmin === 1) {
              req.session.adminLogin = true;
              res.redirect("/admin");
            } else {
              res.redirect('profile/' + memID);
            }
          });

        } else {
          console.log(password, " ", storedPassword);
          res.render("user/signup", {
            message: "Incorrect Password or Username",
          });
        }
      });
    } else {
      console.log("Got here");
      res.render("user/signup", {
        message: "Incorrect Password or Username",
      });
    }
  });

});


customerRouter.get("/profile/:id" , (req, res) => {
  console.log("got here");
  let sql = "select * from customer where membership_ID = ?";
  const id = req.params.id;
  db.query(sql, [id], (err, result, fields) => {
    res.render('user/profile', {
      data: result,
    });
  });

});

customerRouter.post("/profile/:id" ,parseForm, (req, res) => {
  let id = req.params.id;
  let fname = req.body.fname;
  let lname = req.body.lname;
  let uname = req.body.uname;
  let city = req.body.city;
  let phoneNumber = req.body.phoneNumber;
  let email = req.body.email;
  let state = req.body.state
  let zip = req.body.zip;
  console.log(fname, lname, uname, city, phoneNumber, email, state, zip);
  let sql = "UPDATE customer SET first_name = ?, last_name = ?, username = ?, city = ?, phone_number = ?, email = ? , state = ?, zip_code=? WHERE membership_ID = ?";
  db.query(sql, [fname, lname, uname, city, phoneNumber, email, state, zip, id], (err, result, fields) => {
    if (err) {
      console.log(err);
    }
    res.redirect(id);
  });
});

customerRouter.get("/changePassword/:id", (req, res, next) => {
  let id = req.params.id;
  let sql = "select count(password) from customer where password = ";
  res.render('user/passwordChange', {
    data: id,
  });
});
customerRouter.post("/submitPassword/:id", parseForm, (req, res, next) => {
  let id = req.params.id;
  let sql = "select password from customer where membership_ID = ?";
  let oldPass = req.body.oldPass;
  let newPass1 = req.body.newPass1;
  let newPass2 = req.body.newPass2;
  console.log(oldPass + " " + newPass1 + " " + newPass2);
  db.query(sql, [id], async (err, result, fields) => {
    if (err) {
      console.log(err);
    }
    const validate = await bcrypt.compareSync(oldPass, result[0].password);
    if (validate) {
      const hashedPassword = await bcrypt.hashSync(newPass1, 10);
      let q = "UPDATE customer set password = ? WHERE membership_ID = ?";
      if (newPass1 === newPass2) {
        db.query(q, [hashedPassword, id], (err, result, fields) => {
          if (err) console.log(err);
          res.render('user/passwordRes', {
            data: 2,
          });
        });
      } else {
        res.render('user/passwordRes', {
          data: 1,
        });
      }
    } else {
      res.render('user/passwordRes', {
        data: 1,
      });
    }

  });
});

customerRouter.get("/vieworder/:id", (req, res, next) => {
  let id = req.params.id;
  let sql = "select * from order_information where FK_member_transaction = ? ";
  db.query("select amount from payment_information where FK_customer_payment = ?", [id], (err, result, fields) => {
    if (err) console.log(err);
    let price = [];
    //let price = result[0].amount;
    for (var i = 0; i < result.length; i++) {
      price.push(result[i].amount);
    }
    db.query(sql, [id], (err, result, fields) => {
      if (err) console.log(err);
      res.render('shop/orderProfile', {
        data: result,
        orderPrice: price,
        memID: id,
      });
    });
  });


});
customerRouter.get("/logout", (req, res, next)=>{
  try{
  req.session.destroy();
  res.clearCookie('cookie');
  res.redirect('/');
  } catch(e){
    console.log(e);
    res.sendStatus(500);
    res.end();
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  }
  next()
}

module.exports = customerRouter;