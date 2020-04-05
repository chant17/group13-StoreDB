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
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'store_database'
})

function getConnection() {
    return pool
}

//All the requests underneath
const productRouter = express.Router()
productRouter.get('/check/:id', (req, res) =>{
    let sql = 'SELECT * FROM product WHERE product_name = ?';
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

module.exports = productRouter;