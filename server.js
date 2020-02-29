const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

connection.connect(err => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

connection.end(err => {
  if (err) throw err;
  //The connection is terminated
  //Ensures all remaining queries are executed
  //Then sends a quit packet to the MySQL server
  //console.log("Connection terminated");
});

const indexRouter = require("./routes/index");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));

app.use("/", indexRouter);

app.listen(process.env.PORT || 3060);
