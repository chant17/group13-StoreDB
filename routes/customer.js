//handle all customer related routes
const express = require("express");
const customerRouter = express.Router()
const mysql = require("mysql");

//SQL Connection
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "store_database"
// });

// connection.connect((err)=>{
//   if(!err) console.log("Connected to Store DB - Customer Side");
//   else console.log("Can't connect to Store DB - Customer Side");
// });
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


//custom sql param request via the http param
//handling post request
customerRouter.post('/user_create', (req, res) =>{
    console.log("trying to create a new user..");
    const fName = req.body.createFirstName;
    const lName = req.body.createLastName;
    const queryString = "INSERT INTO customer (first_name, last_name, membership_ID, FK_customer_cart) VALUES (?, ?, 12343, 0)";
    getConnection().query(queryString, [fName, lName], (err, result, fields) =>{
      if(err){
        console.log("Failed to append user: " + err);
        res.sendStatus(500);
        return
      }
  
      console.log("Inserted a new user with id: ", result.insertedId);
    })
})

module.exports = customerRouter;