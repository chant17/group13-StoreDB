// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

//DEPENDENCIES and additional utilized NodeJS modules
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan'); //used to track/read the request(s) that we get
const bodyParser = require('body-parser'); //used to handle http request from the browser

//ROUTES VARIABLE
const indexRouter = require("./routes/index.js");
const customerRouter = require('./routes/customer.js');
const productRouter = require('./routes/product.js')

//////////////

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("./views"));
app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/", indexRouter);
app.use("/", customerRouter);
app.use("/", productRouter);



app.listen(process.env.PORT || 3060);

