const dotenv = require("dotenv");
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
dotenv.config({ path: './config.env' });

require('./db/conn');


// using middleware again to avoid undefined error  (because json file nahi samjhta tha)
app.use(express.json()); 
app.use(cookieParser());
// link
app.use(require('./router/auth'));

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