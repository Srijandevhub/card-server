const User = require('../models/userModel');
const Card = require('../models/cardModel');


const getPaneCounts = async (req, res) => {
    try {
        let id;
        let flag = true;
        if (req.user.ref === "0") {
            id = req.user.userId;
        } else {
            id = req.user.ref;
            flag = false;
        }
        const users = await User.find({ ref: id });
        const cards = await Card.find({ userId: id });
        if (!flag) {
            return res.status(200).json({ message: "fetched counts", users: users.length - 1, cards: cards.length })
        }
        return res.status(200).json({ message: "fetched counts", users: users.length, cards: cards.length })
    } catch (error) {
        res.status(500).json({ message: "error while fetching counts", error: error.message });
    }
}

module.exports = { getPaneCounts }