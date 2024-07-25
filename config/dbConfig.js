const mongoose = require('mongoose');

const dbConfig = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("database Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConfig;