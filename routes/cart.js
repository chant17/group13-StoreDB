//handle all customer related routes
const express = require("express");
const cartRouter = express.Router();
const db = require("../config/db");

const redirectLogin = (req, res, next) => {
  if (!req.session.loggedin) {
      res.redirect('/customer/signin');
  } else {
      next();
  }
}

cartRouter.get("/", redirectLogin, (req, res) => {
  let getCart = "SELECT cartID from cust_cart where FK_membershipID = ?";
  console.log(req.session.memID);
  db.query(getCart, [req.session.memID], (err, result, fields) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    let cartID = result[0].cartID;
    let sql = "SELECT * FROM cart where FK_CART_ID = ?";
    //let cartId = req.params.id;
    db.query(sql, [cartID], (err, result, fields) => {
      if (err) {
        console.log("Failed to append user: " + err);
        res.sendStatus(500);
        return;
      }
      res.render('shop/cart', {
        data: result
      });
    });

  });


});

//Update the stock when user buys product
cartRouter.get('/delete/:id', (req, res) => { //the id here would be the product_ID
  let name = req.params.id;
  let sql = "DELETE FROM cart WHERE FK_product_cart = ?"
  db.query(sql, [name], (err, result, fields) => {
    if (err) {
      console.log("Failed to query " + err);
      res.sendStatus(500) //send the error to the browser
      res.end();
      return
    }
  });
  res.redirect('/cart');
});

module.exports = cartRouter;