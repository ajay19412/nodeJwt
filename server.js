global.express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoute = require("./routes/userRoutes");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRoute);

// const crypto = require("crypto");

app.listen(3000, () => {
  mongoose
    .connect("mongodb://localhost:27017/testdb")
    .then(result => {
      console.log("app is running on port 3000");
      console.log("connected to db");
    })
    .catch(err => {
      console.log(err);
    });
});
