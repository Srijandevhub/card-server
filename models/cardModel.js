const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    profileimage: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    company_name: {
        type: String
    },
    designation: {
        type: String
    },
    email: {
        type: String
    },
    phonecode: {
        type: String
    },
    phonenumber: {
        type: String
    },
    country: {
        type: String
    },
    social_links: {
        type: Array
    },
    enable_whatsapp: {
        type: Boolean
    },
    whatsapp_number: {
        type: String
    },
    whatsapp_message: {
        type: String
    },
    userId: {
        type: String
    },
    isPublished: {
        type: Boolean,
        default: false
    }
})

const Card = mongoose.model("cards", cardSchema);

module.exports = Card;