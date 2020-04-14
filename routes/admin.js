//handle all customer related routes
const express = require("express");
const adminRouter = express.Router();
const mysql = require("mysql");
const bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({
    extended: false
});

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
    res.render("user/addAdmin");
});
adminRouter.post("/addPost", parseForm, (req, res) => {
    let prodId = makeid(5);
    let dept = req.body.department;
    let name = req.body.name;
    let prodDesc = req.body.prodDesc;
    let prodVendor = req.body.vendor;
    let quantity = req.body.quantity;
    let price = req.body.price;
    let img = req.body.img;
    console.log(img);
    let sql = "INSERT INTO product (product_id, FK_product_dept_id, product_name, product_desc, buy_price, vendor, quantity_inStock, imgLink) VALUES (?,?,?,?,?,?,?,?)";
    getConnection().query(sql, [prodId, dept, name, prodDesc, price, prodVendor, quantity, img], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.render('user/addAdmin', {
                data: "Failed to insert!"
            });
        }

        res.render('user/addAdmin', {
            data: "Inserted successfully!"
        });
    });

});

adminRouter.get("/update", (req, res, next) => {

    // getConnection().query("select * from customer", (err, result, fields) => {
    //     res.render("user/admin");    
    // });
    res.render("user/updateAdmin", {data: res});

});

adminRouter.post("/updatePostDept", parseForm, (req, res, next) => {
    let id = req.body.department;
    getConnection().query("select * from product where FK_product_dept_id = ?",[id], (err, result, fields) => {
        res.render("user/updateAdmin", {data: result});    
    });

});
adminRouter.post("/updatePostProd", parseForm, (req, res, next) => {
    let id = req.body.product;
    getConnection().query("select * from product where product_ID = ?",[id], (err, result, fields) => {
        res.render("user/updateAdminProduct", {data: result});    
    });

});

adminRouter.post("/modifyProd", parseForm, (req, res, next) => {
    
    let id = req.body.prodID;
    let name = req.body.name;
    let desc = req.body.prodDesc;
    let price = req.body.price;
    let vendor = req.body.vendor;
    let imgLink = req.body.img;
    let quantity = req.body.quantity;
    let sql = "UPDATE product SET product_name = ?, product_desc = ?, vendor = ?, buy_price = ?, quantity_inStock = ?, imgLink = ? WHERE product_ID = ?";
    getConnection().query(sql,[name, desc, vendor, price, quantity, imgLink, id], (err, result, fields) => {
        if(err){
            console.log(err);
        }
        res.redirect("/admin/update");    
    });

});

adminRouter.get("/report", (req, res, next) => {

    // getConnection().query("select * from customer", (err, result, fields) => {
    //     res.render("user/admin");    
    // });
    res.render("user/reportAdmin");

});
adminRouter.get("/view", (req, res, next) => {

    getConnection().query("select * from customer", (err, result, fields) => {
        res.render("user/viewAdmin", {data:result});    
    });

});

adminRouter.get("/deleteUser/:id", (req, res, next) => {
    let id = req.params.id;
    let sql = "DELETE FROM customer WHERE membership_ID = ?"
    getConnection().query(sql, [id], (err, result, fields) => {
        if (err) {
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
            return
        }
    }); 
    res.redirect('/admin/view');

});

adminRouter.get("/delete", (req, res) => {
    let sql = "SELECT * FROM product";
    //let cartId = req.params.id;
    getConnection().query(sql, (err, result, fields) => {
        if (err) {
            console.log("Failed to append user: " + err);
            res.sendStatus(500);
            return;
        }
        res.render('user/deleteAdmin', {
            data: result
        });
    });

});

//Update the stock when user buys product
adminRouter.get('/delete/:id', (req, res) => { //the id here would be the product_ID
    let name = req.params.id;
    let sql = "DELETE FROM product WHERE product_ID = ?"
    getConnection().query(sql, [name], (err, result, fields) => {
        if (err) {
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
            return
        }
    });
    res.redirect('/admin/delete');
});

function makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = adminRouter;