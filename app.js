const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
dotenv.config({ path: './config.env' });
const sendgrid = require('@sendgrid/mail');
const morgan = require("morgan");
const path = require("path");
//contact
const contactRoute = require('./router/contact-router'); 
require('./db/conn');
const cors = require('cors');
const adminRoute = require("./router/admin-router");
// using middleware again to avoid undefined error  (because json file nahi samjhta tha)
app.use(express.json()); // changes buffer to json nahi lagaya tho request.body will be null
app.use(morgan("tiny"));

app.use(cookieParser());
// link
app.use(require('./router/auth'));
app.use(cors({ origin: 'http://localhost:3000' }));

const pet = require("./routes/pet");
const category = require("./routes/category");
const adoption = require("./routes/adoption");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/pets", pet);
app.use("/api/category", category);
app.use("/api/adoption", adoption);
app.use("/api/form", contactRoute) //contact
// admin route
app.use ("/api/admin/users", adminRoute);
const PORT = process.env.PORT;

// app.get('/about', (req, res) => {
//     console.log(`Hello my About`);
//     res.send(`Hello About world from the server`);
// });

// app.get('/contact' ,(req, res) => {
//     // res.cookie("test", "rohan");
//     res.send('hello contacts from the pawfect finds');

// });

app.get('/signin' ,(req, res) => {
    res.send('hello please login from the pawfect finds');

});

app.get('/register' ,(req, res) => {
    res.send('hello register for using the pawfect finds');

});

app.listen(PORT, () => {
    console.log(`server is runnig at port no ${PORT}`);
})