// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

//DEPENDENCIES and additional utilized NodeJS modules
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const morgan = require('morgan'); //used to track/read the request(s) that we get
const bodyParser = require('body-parser'); //used to handle http request from the browser
const session = require('express-session');

//ROUTES VARIABLE
const indexRouter = require("./routes/index.js");
const customerRouter = require('./routes/customer.js');
const productRouter = require('./routes/product.js');
const departmentRouter = require('./routes/department.js');


//////////////

app.set("view engine", "ejs");
app.set("views", [__dirname + "/views", __dirname + "/views/shop", __dirname + "/views/partials"]);
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("./views"));
app.use(morgan('short'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/", indexRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);
app.use("/department", departmentRouter);


//----------------------
const PORT = process.env.PORT || 3060;

app.listen(PORT, () =>{
  console.log("Server is up, running and listening on: " + PORT);
});

