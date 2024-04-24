// const { Schema , model } = require("mongoose");
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
         type: String,
        required:true
    },
    phone: {
        type: Number,
        required:true
    },
    message: {
        type: String,
        required:true
    },
});
// module.exports = contact = mongoose.model("Contact", contactSchema);

// const Contact= new model("Contact", contactSchema);
// module.exports = Contact;

module.exports = Contact = mongoose.model("Category", contactSchema);
