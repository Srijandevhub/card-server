const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    companyname: {
        type: String
    },
    jobtitle: {
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
    password: {
        type: String
    },
    ref: {
        type: String,
        default: "0"
    },
    modules: {
        type: Object,
        default: {
            "cardmanagement": true,
            "cardmanagementaccess": {"create": true, "delete": true, "share": true, "edit": true},
            "usermanagement": true,
            "usermanagementaccess": {"create": true, "delete": true, edit: true}
        }
    },
    firstLogin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("users", userSchema);

module.exports = User;