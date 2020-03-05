if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to Store Database");
});

app.use("/", indexRouter);

app.listen(process.env.PORT || 3060);
