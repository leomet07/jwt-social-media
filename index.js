const express = require("express");
const app = express();
app.use(express.json())
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

// Connect to db
mongoose.connect(
    process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => {
        console.log("connected to db!");
    }
);

// Middleware

//Routes Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => {
    console.log("Sever is up and running");
});