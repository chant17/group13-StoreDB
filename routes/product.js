//handle all product related routes
const express = require("express");
const mysql = require("mysql");

//SQL Connection
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "store_database"
// });

// connection.connect((err)=>{
//   if(!err) console.log("Connected to Store DB - Product Side");
//   else console.log("Can't connect to Store DB - Product Side");
// });
//use createPool to decrease redundancy of connection

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'dw4h1mb7skn1bu0n',
    password: 'z31mjqf5qy22tlbm',
    database: 'woivccvvos2pfj3e'
})

function getConnection() {
    return pool
}

//All the requests underneath

//Get all product within the requested department
const productRouter = express.Router()
productRouter.get('/cart/:id', (req, res) =>{
    let sql = 'SELECT product_name, buy_price FROM product WHERE product_ID = ?';
    let prodID = req.params.id;
    let prodName = "";
    let prodPrice = "";
    getConnection().query(sql, [prodID], (err, result, fields) =>{
        if(err){
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
            return
        }
        
        prodName = result[0].product_name;
        prodPrice = result[0].buy_price;
        checkQuery = "SELECT COUNT(*) as occurence FROM cart WHERE FK_cart_ID = 2 and FK_product_cart = ?";
        getConnection().query(checkQuery, [prodID], (err, result, fields) =>{
            if(err){
                console.log("Failed to query " + err);
                res.sendStatus(500) //send the error to the browser
                res.end();
                return;
            }
            if(result[0].occurence > 0){ //check if the product is already in the cart => increase the quantity by 1
                let updateQuery = "UPDATE cart set quantity = quantity + 1 where FK_product_cart = ? and FK_cart_ID = 2; ";
                getConnection().query(updateQuery, [prodID], (err, result, fields) =>{
                    if(err){
                        console.log("Failed to query " + err);
                        res.sendStatus(500) //send the error to the browser
                        res.end();
                        return;
                    }
                });
            }
            else{ // if the product is not in the cart, create a new instance in cart table 
                let sql2 = "INSERT INTO cart (FK_cart_ID, FK_product_cart, product_name, price, quantity) VALUES (2,?,?,?,1)";
                getConnection().query(sql2, [prodID, prodName, prodPrice], ( err, result2, fields) =>{
                if(err){
                    console.log("Failed to query " + err);
                    res.sendStatus(500) //send the error to the browser
                    res.end();
                    return;
                    }
                });
            }            
        
        res.redirect('/');
        res.end();
        });
    });

});




module.exports = productRouter;