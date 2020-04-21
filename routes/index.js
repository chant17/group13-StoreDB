const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const db = require("../config/db");

const redirectLogin = (req, res, next) =>{
  if(!req.session.loggedin){
    res.redirect('/customer/signin');
  }
  else{
    next();
  }
}
router.get("/", redirectLogin, (req, res) => {
  res.render("layouts/layout");
});

module.exports = router;