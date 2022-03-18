const express = require('express');
const mongoose = require('mongoose');
const users = require("./routes/users");
const tf = require('@tensorflow/tfjs');
const login = require('./routes/login');
const auth = require('./middleware/auth')
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", users);
app.use("/api/login", login);
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static('./static'));
mongoose.connect("mongodb://localhost/Hackathon-Database", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to mongoDb")
    })
    .catch((err) => {
        console.log("Error connecting to DB", err)
    });
app.get("/register", (req, res) => {
    res.render('register')
});
app.get("/login", (req, res) => {
    res.render('login')
})
app.get("/homePage", auth, (req, res) => {
    res.render('homePage');
})
app.get("/predict", (req, res) => {
    res.render("prediction");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port:", port);
});