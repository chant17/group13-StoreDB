//handle all department related routes
const express = require("express");
const departmentRouter = express.Router()
const mysql = require("mysql");

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

departmentRouter.get('/', (req, res) => {
    res.send('My name is Jeff');
})

module.exports = departmentRouter;
