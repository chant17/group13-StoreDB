//handle all customer related routes
const express = require("express");
const adminRouter = express.Router();
const mysql = require("mysql");
const db = require("../config/db");
const bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({
    extended: false
});

//middleware
const redirectLogin = (req, res, next) => {
    if (!req.session.adminLogin) {
        res.redirect('/customer/signin');
    } else {
        next();
    }
}

adminRouter.get("/", redirectLogin, (req, res, next) => {

    db.query("select * from customer", (err, result, fields) => {
        res.render("user/admin");
    });

});

adminRouter.get("/add", redirectLogin ,(req, res, next) => {
    res.render("user/addAdmin");
});
adminRouter.post("/addPost", redirectLogin, parseForm, (req, res) => {
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
    db.query(sql, [prodId, dept, name, prodDesc, price, prodVendor, quantity, img], (err, result, fields) => {
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

adminRouter.get("/update", redirectLogin ,(req, res, next) => {

    // db.query("select * from customer", (err, result, fields) => {
    //     res.render("user/admin");    
    // });
    res.render("user/updateAdmin", {
        data: res
    });

});

adminRouter.post("/updatePostDept", parseForm, (req, res, next) => {
    let id = req.body.department;
    db.query("select * from product where FK_product_dept_id = ?", [id], (err, result, fields) => {
        res.render("user/updateAdmin", {
            data: result
        });
    });

});
adminRouter.post("/updatePostProd", parseForm, (req, res, next) => {
    let id = req.body.product;
    db.query("select * from product where product_ID = ?", [id], (err, result, fields) => {
        res.render("user/updateAdminProduct", {
            data: result
        });
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
    db.query(sql, [name, desc, vendor, price, quantity, imgLink, id], (err, result, fields) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/admin/update");
    });

});

adminRouter.get("/report", redirectLogin ,(req, res, next) => {

    // db.query("select * from customer", (err, result, fields) => {
    //     res.render("user/admin");    
    // });
    res.render("user/reportAdmin");

});

adminRouter.post("/saleReport", parseForm, (req, res, field) => {
    let sd = changeDate(req.body.startDate);
    let ed = changeDate(req.body.endDate);
    let sql = "select SUM(amount)as total from payment_information where date(payment_date) >= ? and date(payment_date) <= ?;";
    db.query(sql, [sd, ed], (err, result, fields) => {
        let k = result[0].total;
        let subsql = 'select date(payment_date) as date, sum(amount) as total from payment_information where payment_date >= ? and payment_date <= ? group by payment_date';
        db.query(subsql, [sd, ed], (err, result, fields) => {
            var maxNum = 0;
            let dateTime;
            for (var i = 0; i < result.length; i++) {
                if (result[i].total > maxNum) {
                    maxNum = result[i].total;
                    dateTime = result[i].date;
                }
            }
            res.render("report/saleReport", {
                dataUno: result,
                dataDos: maxNum,
                dataDosDos: dateTime,
                dataTres: k
            });

        });
    });


});


adminRouter.post("/deptReport", parseForm, (req, res, next) => {
    let dept = req.body.deptSelector;
    db.query("select * from product where FK_product_dept_id = ? and quantity_inStock < 15", [dept], (err, result, fields) => {
        let lowStock = result;
        db.query("select AVG(buy_price) as avgPrice from product where FK_product_dept_id = ?", [dept], (err, result, fields) => {
            let avg = result[0].avgPrice;
            let sql = "select product_name, buy_price from product where FK_product_dept_id = ? and buy_price = (select min(buy_price) from product where FK_product_dept_id = ?) or buy_price = (select max(buy_price) from product where FK_product_dept_id = ?) order by buy_price;"
            db.query(sql, [dept, dept, dept], (err, result, fields) => {
                let min = result[0].buy_price;
                let minProd = result[0].product_name;
                let max = result[1].buy_price;
                let maxProd = result[1].product_name;
                res.render('report/deptreport', {
                    stock: lowStock,
                    average: avg,
                    minimumProd: minProd,
                    maximumProd: maxProd,
                    minimum: min,
                    maximum: max
                });
            });
        });
    });


});

adminRouter.get("/view",redirectLogin, (req, res, next) => {

    db.query("select * from customer", (err, result, fields) => {
        res.render("user/viewAdmin", {
            data: result
        });
    });

});

adminRouter.get("/deleteUser/:id", redirectLogin , (req, res, next) => {
    let id = req.params.id;
    let sql = "DELETE FROM customer WHERE membership_ID = ?"
    db.query(sql, [id], (err, result, fields) => {
        if (err) {
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
            return
        }
    });
    res.redirect('/admin/view');

});

adminRouter.get("/delete",redirectLogin, (req, res) => {
    let sql = "SELECT * FROM product";
    //let cartId = req.params.id;
    db.query(sql, (err, result, fields) => {
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
adminRouter.get('/delete/:id', redirectLogin ,(req, res) => { //the id here would be the product_ID
    let name = req.params.id;
    let sql = "DELETE FROM product WHERE product_ID = ?"
    db.query(sql, [name], (err, result, fields) => {
        if (err) {
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
            return
        }
    });
    res.redirect('/admin/delete');
});

adminRouter.get('/order', redirectLogin ,(req, res) => { //the id here would be the product_ID
    
    let sql = "select transaction_ID, FK_member_transaction, order_date, expected_Delivery, order_status, p.amount from order_information o, payment_information p where o.FK_payment_ID = p.checkNum;";
    db.query(sql, (err, result, fields) => {
        if (err) {
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
        
            return
        }
        res.render('user/orderAdmin',{
            data: result
        });
    });
    
});

adminRouter.get('/changeProgress/:transID', redirectLogin ,(req, res) => { //the id here would be the product_ID
    let transID = req.params.transID;
    let sql = "UPDATE order_information SET order_status = 1 WHERE transaction_ID = ?";
    db.query(sql, [transID],(err, result, fields) => {
        if (err) {
            console.log("Failed to query " + err);
            res.sendStatus(500) //send the error to the browser
            res.end();
            return
        }
        res.redirect('/admin/order');
    });
    
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

function changeDate(data) {
    var result = '';
    result += data.slice(6, 10) + '-' + data.slice(0, 2) + '-' + data.slice(3, 5); // + " 00:00:00";
    return result;
}



module.exports = adminRouter;