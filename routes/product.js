//handle all product related routes
const express = require("express");
const mysql = require("mysql");
const db = require("../config/db");


const redirectLogin = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/customer/signin');
    } else {
        next();
    }
  }

//Get all product within the requested department
const productRouter = express.Router();
productRouter.get("/cart/:id", redirectLogin ,(req, res) => {
  let sql = "SELECT product_name, buy_price FROM product WHERE product_ID = ?";
  let prodID = req.params.id;
  let prodName = "";
  let prodPrice = "";
  db.query(sql, [prodID], (err, result, fields) => {
    if (err) {
      console.log("Failed to query " + err);
      res.sendStatus(500); //send the error to the browser
      res.end();
      return;
    }

    prodName = result[0].product_name;
    prodPrice = result[0].buy_price;
    imgLink = result[0].imgLink;
    prodDesc = result[0].product_desc;
    let checkCartID = "SELECT cartID FROM cust_cart WHERE FK_membershipID = ?";
    db.query(checkCartID, [req.session.memID], (err, result, fields) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        res.end();
      }
      let cartID = result[0].cartID;
      checkQuery =
        "SELECT COUNT(*) as occurence FROM cart WHERE FK_cart_ID = ? and FK_product_cart = ?";
      db.query(checkQuery, [cartID, prodID], (err, result, fields) => {
        if (err) {
          console.log("Failed to query " + err);
          res.sendStatus(500); //send the error to the browser
          res.end();
          return;
        }
        if (result[0].occurence > 0) {
          //check if the product is already in the cart => increase the quantity by 1
          let updateQuery =
            "UPDATE cart set quantity = quantity + 1 where FK_product_cart = ? and FK_cart_ID = ?;";
          db.query(updateQuery, [prodID, cartID], (err, result, fields) => {
            if (err) {
              console.log("Failed to query " + err);
              res.sendStatus(500); //send the error to the browser
              res.end();
              return;
            }
          });
        } else {
          // if the product is not in the cart, create a new instance in cart table
          let sql2 =
            "INSERT INTO cart (FK_cart_ID, FK_product_cart, product_name, price, quantity, product_desc, imgLink) VALUES (?,?,?,?,1,?,?)";
          db.query(
            sql2,
            [cartID, prodID, prodName, prodPrice, imgLink, prodDesc],
            (err, result2, fields) => {
              if (err) {
                console.log("Failed to query " + err);
                res.sendStatus(500); //send the error to the browser
                res.end();
                return;
              }
            }
          );
        }
        res.redirect("/");
        res.end();
      });
    });
  });
});

module.exports = productRouter;
