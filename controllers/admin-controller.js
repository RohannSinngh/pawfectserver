const { default: Contact } = require("../../client/src/components/Contact");
const User = require("../model/userSchema");
const Contact = require("../models/contact-model");
const getAllUsers = async(req, res) => {
try{
    const users = await User.find()
    console.log(users);
    // if (!users || users.length)
    res.status(200).json(users);
}catch(error){
    next(error);
}
};

// const getAllContacts = async(req, res) => {
//     try{
//         const contacts = await Contact.find()
//         console.log(users);
//         // if (!users || users.length)
//         res.status(200).json(users);
//     }catch(error){
//         next(error);
//     }
//     };


// module.exports = {getAllUsers, getAllContacts};
module.exports = {getAllUsers };