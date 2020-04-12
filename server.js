//DEPENDENCIES and additional utilized NodeJS modules
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan'); //used to track/read the request(s) that we get
const bodyParser = require('body-parser'); //used to handle http request from the browser
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
//ROUTES VARIABLE
const indexRouter = require("./routes/index.js");
const customerRouter = require('./routes/customer.js');
const productRouter = require('./routes/product.js');
const departmentRouter = require('./routes/department.js');
const cartRouter = require('./routes/cart.js');
const adminRouter = require('./routes/admin.js');
app.use("/customer", customerRouter);
app.use("/product", productRouter);
app.use("/department", departmentRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);
app.use("/", indexRouter);


//////////////
app.use(morgan('short'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//app.use(cookieParser());
//app.use(session({secret: 'secretkey', resave: false, saveUninitalized: false}))


//----------------------
const PORT = process.env.PORT || 3060;

app.listen(PORT, () => {
  console.log("Server is up, running and listening on: " + PORT);
});