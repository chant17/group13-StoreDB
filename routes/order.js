//handle all customer related routes
const express = require("express");
const orderRouter = express.Router();
const db = require("../config/db");

orderRouter.get("/orderinfo/:id", (req, res) => {
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
    let transID = makeid(6);
    let paymentID = makeid(2) + '-' + makeid(7);
    let sql = "select k.cartID from customer c, cust_cart k where c.membership_ID = k.FK_membershipID and c.membership_ID = 7;";
    let sqlPrice = "select sum(price) as price from cart where FK_cart_ID = ?";
    let sql2 = "insert into order_information (transaction_id, FK_member_transaction, FK_payment_ID, order_date, expected_Delivery, shipped_Date, order_status, FK_cart_transaction) values (?,?,?,?,?,?,0,?);";
    let sql3 = "insert into payment_information (FK_customer_payment, checkNum, payment_date, amount) VALUES (?,?,?,?);";
    let sql4 = "DELETE from cart where FK_cart_ID = ?";
    
    db.query(sql, [id], (err, result, fields) => {
        if (err) console.log(err);
        let cartID = result[0].cartID;
        console.log(cartID);
        db.query(sqlPrice, [cartID], (err, result, fields) => {
            if (err) console.log(err);
            let price = result[0].price;
            console.log(price);
            let updateCredit = "UPDATE customer SET store_credit = store_credit + ? where membership_id = ?;"
            db.query(updateCredit, [price,id], (err, result, fields) => {
                if (err) console.log(err);
            });
            db.query(sql3, [id, paymentID, today, price], (err, result, fields) => {
                if (err) console.log(err);
            });
            db.query(sql2, [transID, id, paymentID, today, sDate, sDate, cartID], (err, result, fields) => {
                if (err) console.log(err);
            });
            db.query(sql4, [cartID], (err, result, fields) => {
                if (err) console.log(err);
            });
            console.log(transID + " " + paymentID + " " + price + " " + cartID);
            res.render('shop/orderInfo', {
                status: 0,
                total: price,
                orderID : transID
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