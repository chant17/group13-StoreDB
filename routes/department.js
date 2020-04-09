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
        //res.render("shop/dept.ejs", sendBack);
        //res.redirect("shop/dept.ejs");
    })
   
})

module.exports = departmentRouter;
