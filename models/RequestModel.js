const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    request: {
        type: String
    },
    userId: {
        type: String
    },
    chat: {
        type: Array,
        default: [
            {
                person: "access",
                text: "Wait, we will resolve your query soon!"
            }
        ]
    },
    isResolved: {
        type: Boolean,
        default: false
    }
});

const Request = mongoose.model("requests", requestSchema);

module.exports = Request;