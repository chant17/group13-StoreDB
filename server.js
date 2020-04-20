//DEPENDENCIES and additional utilized NodeJS modules
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan'); //used to track/read the request(s) that we get
const bodyParser = require('body-parser'); //used to handle http request from the browser
const mysql = require('mysql');
app.set('view engine', 'ejs');
var path = require('path');
app.use(express.static(path.join(__dirname + "/public")));
//ROUTES VARIABLE
const session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');

// Middleware and stuff
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Routes Variables
const indexRouter = require("./routes/index.js");
const customerRouter = require('./routes/customer.js');
const productRouter = require('./routes/product.js');
const departmentRouter = require('./routes/department.js');
const cartRouter = require('./routes/cart.js');
const adminRouter = require('./routes/admin.js');
const orderRouter = require('./routes/order.js');
app.use("/order", orderRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);
app.use("/department", departmentRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);
app.use("/", indexRouter);
 
//----------------------
const PORT = process.env.PORT || 3666;

app.listen(PORT, () => {
  console.log("Server is up, running and listening on: " + PORT);
});