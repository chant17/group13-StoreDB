//handle all customer related routes
const express = require("express");
const cartRouter = express.Router();
const db = require("../config/db");

cartRouter.get("/", (req, res) => {
  let sql = "SELECT * FROM cart where FK_CART_ID = 6";
  //let cartId = req.params.id;
  db.query(sql, (err, result, fields) => {
    if (err) {
      console.log("Failed to append user: " + err);
      res.sendStatus(500);
      return;
    }
    res.render('shop/cart', {data: result});
  });
  
});

//Update the stock when user buys product
cartRouter.get('/delete/:id', (req, res) =>{ //the id here would be the product_ID
  let name = req.params.id;
  let sql = "DELETE FROM cart WHERE FK_product_cart = ?"
  db.query(sql, [name], (err, result, fields) =>{
      if(err){
          console.log("Failed to query " + err);
          res.sendStatus(500) //send the error to the browser
          res.end();
          return
      }
  });
  res.redirect('/cart');
});

module.exports = cartRouter;
