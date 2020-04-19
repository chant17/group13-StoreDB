const express = require("express");
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'dw4h1mb7skn1bu0n',
    password: 'z31mjqf5qy22tlbm',
    database: 'woivccvvos2pfj3e',
    dateStrings: 'date'
})

module.exports = pool;