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
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b4874dff319508',
    password: '4502323b',
    database: 'heroku_a8eb06a479b4a0d'
})

function getConnection() {
    return pool
}

//All the requests underneath

//Get all product within the requested department
const productRouter = express.Router()
productRouter.get('/check/:id', (req, res) =>{
    let sql = 'SELECT * FROM product WHERE FK_product_dept_id = 2';
    let pname = req.params.id;
    getConnection().query(sql, [pname], (err, result, fields) =>{
        if(err){
        console.log("Failed to query " + err);
        res.sendStatus(500) //send the error to the browser
        res.end();
        return
        }
        res.json(result);
    })
})

//Update the stock when user buys product
productRouter.get('/update/:id', (req, res) =>{ //the id here would be the product_ID
    let name = req.params.id + " " + "yote";
    let k = "Yeet " + name;
    res.render("layouts/layout.ejs", {username: k});
});




// getConnection().query('SELECT product_ID FROM product', (err, result) =>{
//     console.log(result);
// })

module.exports = productRouter;