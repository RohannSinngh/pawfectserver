const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate= require("../middleware/authenticate");


require('../db/conn');
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send(`Hello world from the server rotuer js`);
});

//promises
// router.post('/register', (req, res) => {
//     const { name , email , phone , work, password , cpassword } = req.body;

//     // validation (no empty field)
//     if(!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "missing entry"});
//     }
//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//             return res.status(422).json({ error: "email already exist"});
//         }
        
//             const user = new User({name , email , phone , work, password , cpassword});

//             user.save().then(() => {
//                 res.status(201).json({ message: "email already exist"});
//             }).catch((err) => res.status(500).json({error:"FAiled to register"})); // incase of any error wen the data is not stored

//     }).catch(err => { console.log(err); });
// });
// module.exports = router;

router.post('/register', async (req, res) => {
    const { name , email , phone , work, password , cpassword } = req.body;

    // validation (no empty field)
    if(!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "missing entry"});
    }
    try {

        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "email already exist"});
        }else if(password != cpassword){
            return res.status(422).json({ error: "no matching passwords"});       
        }else {
             const user = new User({name , email , phone , work, password , cpassword});
             // yaha pe pre post bycryptic
            await user.save();

            res.status(201).json({ message: "user registered successfully"});
        }

    } catch (err){
        console.log(err);
    }
});

// login
router.post('/signin', async (req, res) => {
    try{
        let token;
        const { email , password} = req.body;
// 3 validations.. 
        if(!email || !password) {                       // this jwt refers here     
            return res.status(400).json({error:"field empty details required"})
        }

        const userLogin = await User.findOne({email:email});
        // console.log(userLogin);
        if (userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password); // pheele user ne jph data fill kiya voh aaega

            token = await userLogin.generateAuthToken(); //get karna hai yaha 
            console.log(token);

            res.cookie("jwtoken", token, {
                expires :new Date(Date.now() + 25892000000),
                httpOnly:true
            });

        if(!isMatch) {
            res.status(400).json({message:"invalid credentials pass"});
        }   else {
            res.json({message:"signin successfull"});
        }
        }  else {
             res.status(400).json({message:"invalid credentials"});
        
        }

    } catch(err){
        console.log(err);
    }
});

// about us page
router.get('/about', authenticate ,(req, res) => {
    console.log(`Hello my About`);
    res.send(req.rootUser);
});

// get user data for cintact us and home page
router.get('/getdata', authenticate, (req, res) => {
    console.log(`Hello my About`);
    res.clearCookie('jwtoken', {path:'/login'});
    res.send(req.rootUser);
});

/// contact us page 
router.post('/contact' , authenticate,async (req, res) => {
    try {    
        // Get the form data from the request body
        const { name, email, phone, message } = req.body; // object destructuring 
    
         // Check if any of the required fields are empty
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ error: 'Please fill in all the fields' });
        }

        const userContact = await User.findOne({ _id : req.userID});

        if(userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);

            await userContact.save();

            res.status(201).json({message:"Contact form submitted successfully"})
        }

      } catch (error) {
        // Handle errors
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

// pet adopt  
router.get('/adoption', authenticate ,(req, res) => {
    console.log(`Hello welcome to pet addoption`);
    res.send(req.rootUser);
});

//pet accessories
router.get('/accessories', authenticate ,(req, res) => {
    console.log(`Hello welcome to pet accessories page`);
    res.send(req.rootUser);
});

// // logout us page
// router.get('/logout', (req, res) => {
//     console.log(`Hello my logout page`);
//     res.clearCookie('jwtoken', {path:'/login'});
//     res.status(200).send('user successfully logges out');
// });

router.get('/logout', (req, res) => {
    console.log('Hello my LogOut');
    
    if (!req.cookies || !req.cookies.jwtoken) {
      res.status(401).json({ error: 'Login first' });
    } else {
      res.clearCookie('jwtoken', { path: '/' });
      res.status(200).json({ message: 'User LogOut Successfully' });
    }
  });

    
module.exports = router;