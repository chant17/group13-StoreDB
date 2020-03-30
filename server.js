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
  password: "password",
  database: "store_database"
});

connection.connect((err)=>{
  if(!err)
  {
      console.log("Connected to Store DB");
  }
  else{
      console.log("Can't connect to Store DB");
  }
});

app.use("/", indexRouter);

app.post('/check', (req, res) =>{
  let sql = 'SELECT * FROM customer';
  connection.query(sql, (err, result) =>{
    if(err) throw err;
    res.send(sql);
  })
})

app.listen(process.env.PORT || 3060);

