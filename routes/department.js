//handle all department related routes
const express = require("express");
const departmentRouter = express.Router()
const db = require("../config/db");


departmentRouter.get('/:id', (req, res) => {
    let deptQuery = 'SELECT * from product where FK_product_dept_id = ?';
    deptId = req.params.id;
    db.query(deptQuery, [deptId], (err, result, fields) => {
        if (err) {
            console.log("Failed to get the department " + err);
            res.sendStatus(500);
            return
        }
        res.render('shop/dept', {data: result});
    })
   
})

module.exports = departmentRouter;