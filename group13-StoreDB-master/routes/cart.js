//handle all customer related routes
const express = require("express");
const cartRouter = express.Router();
const mysql = require("mysql");


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

cartRouter.get("/", (req, res) => {
  let sql = "SELECT * FROM cart where FK_CART_ID = 2";
  //let cartId = req.params.id;
  getConnection().query(sql, (err, result, fields) => {
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
  getConnection().query(sql, [name], (err, result, fields) =>{
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
