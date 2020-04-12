//handle all department related routes
const express = require("express");
const departmentRouter = express.Router()
const mysql = require("mysql");

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

departmentRouter.get('/:id', (req, res) => {
    let deptQuery = 'SELECT * from product where FK_product_dept_id = ?';
    deptId = req.params.id;
    getConnection().query(deptQuery, [deptId], (err, result, fields) => {
        if (err) {
            console.log("Failed to get the department " + err);
            res.sendStatus(500);
            return
        }
        var productGroup = [];
        var counter = 3;
        for(var i=0; i<result.lenght; i+= counter){
            productGroup.push(result.slice(i, i + counter));
        }
        res.render('shop/dept', {data: result});
    })
   
})

module.exports = departmentRouter;
