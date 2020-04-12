//handle all customer related routes
const express = require("express");
const adminRouter = express.Router();
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

adminRouter.get("/", (req, res, next) => {

    getConnection().query("select * from customer", (err, result, fields) => {
        res.render("user/admin");
    });

});

adminRouter.get("/add", (req, res, next) => {

    // getConnection().query("select * from customer", (err, result, fields) => {
    //     res.render("user/admin");    
    // });
    res.render("user/addAdmin");

});


module.exports = adminRouter;