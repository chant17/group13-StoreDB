const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  var message = "";
  res.render("layouts/layout");
});

module.exports = router;