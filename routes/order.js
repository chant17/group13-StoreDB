//handle all customer related routes
const express = require("express");
const orderRouter = express.Router();
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({
    extended: true
});
const db = require("../config/db");

orderRouter.get("/orderinfo/:id/:total", parseForm, (req, res) => {
    /// get curr date and shipping date
    var today = new Date();
    var shipDate = new Date();
    var sDate = "";
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    shipDate.setDate(today.getDate() + 5);
    var dds = String(shipDate.getDate()).padStart(2, '0');
    var mms = String(shipDate.getMonth() + 1).padStart(2, '0');
    var yyyys = String(shipDate.getFullYear()).padStart(2, '0');
    today = yyyy + '/' + mm + '/' + dd;
    sDate = yyyys + '/' + mms + '/' + dds;
    //////
    let id = req.params.id;
    var price = req.params.total;
    let transID = makeid(6);
    let paymentID = makeid(2) + '-' + makeid(7);
    let sql = "select k.cartID from customer c, cust_cart k where c.membership_ID = k.FK_membershipID and c.membership_ID = ?;";
    let sql2 = "insert into order_information (transaction_id, FK_member_transaction, FK_payment_ID, order_date, expected_Delivery, shipped_Date, order_status, FK_cart_transaction) values (?,?,?,?,?,?,0,?);";
    let sql3 = "insert into payment_information (FK_customer_payment, checkNum, payment_date, amount) VALUES (?,?,?,?);";
    let sql4 = "DELETE from cart where FK_cart_ID = ?";
    db.query(sql, [id, req.session.memID], (err, result, fields) => {
        if (err) console.log("here1 " + err);
        let cartID = result[0].cartID;
        console.log(cartID);


        let updateCredit = "UPDATE customer SET store_credit = IFNULL(store_credit, 0) + ? where membership_id = ?;"
        db.query(updateCredit, [price, id], (err, result, fields) => {
            if (err) console.log("here3" + err);
        });

        console.log(transID + " " + paymentID + " " + price + " " + cartID);
        let sql5 = "select FK_product_cart from cart where FK_cart_ID = ?;";
        db.query(sql5, [cartID], (err, result, fields) => {
            if (err) console.log("here 7 " + err);
            // if (result.length == 0) {
            //     res.redirect("/");
            //     console.log("NO PRODUCT!!");
            // }
            db.query(sql3, [id, paymentID, today, price], (err, result, fields) => {
                if (err) console.log("here4" + err);
                db.query(sql2, [transID, id, paymentID, today, sDate, sDate, cartID], (err, result, fields) => {
                    if (err) console.log("here5" + err);
                });
            });

            for (var i = 0; i < result.length; i++) {
                let prodId = result[i].FK_product_cart;
                console.log(prodId);
                let sql6 = "update product set quantity_inStock = quantity_inStock - (select quantity from cart where FK_product_cart = ?) where product_id = ?;";
                db.query(sql6, [prodId, prodId], (err, result, fields) => {
                    if (err) {
                        console.log("here 9 " + err);
                    }
                });
            }

            db.query(sql4, [cartID], (err, result, fields) => {
                if (err) {
                    console.log("HERE 6" + err);
                }
                let checkPrice = "SELECT amount from payment_information where FK_customer_payment = ? AND checkNum = ?";
                db.query(checkPrice, [req.session.memID, paymentID], (err, result, fields) => {
                    if (err) {
                        console.log("price check error: " + err);
                    }
                    let updatedPrice = result[0].amount;
                    console.log("Price is: " + updatedPrice);
                    res.render('shop/orderInfo', {
                        status: 0,
                        total: updatedPrice,
                        orderID: transID
                    });
                });

            });


        });

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

module.exports = orderRouter;