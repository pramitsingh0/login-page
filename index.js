const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const User = require("./models/user");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("public", path.join(__dirname, "public"));
app.use(express.static("public"));
require("dotenv").config();

console.log(process.env.MONGO_URI);
app.use(bodyParser.urlencoded({ extended: true }));
async function dbConnect() {
  await mongoose.connect(process.env.MONGO_URI);
}
dbConnect().then(() => console.log("Connected to db"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/user/register", (req, res) => {
  res.render("register");
});

app.get("/user/signup/:medium", (req, res) => {
  const { medium } = req.params;
  res.render("signup", { loginMedium: medium });
});

app.post("/user/signupMedium", (req, res) => {
  const medium = req.body.loginMedium;
  res.redirect(`/user/signup/${medium}`);
});

app.post("/user/save", async (req, res) => {
  try {
    const user = new User(req.body.user);
    console.log(user);
    await user.save();
    console.log(user);
    res.send("Login Successful");
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Listening on port 3000");
});
