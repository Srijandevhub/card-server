const Card = require("../models/cardModel");
const fs = require('fs');

const saveCard = async (req, res) => {
    try {
        const { first_name, last_name, company_name, designation, email, phonecode, phonenumber, country, social_links, enable_whatsapp, whatsapp_number, whatsapp_message, isPublished } = req.body;
        
        const profileimage = req.file ? req.file.path : null;
        const userId = req.user.ref === "0" ? req.user.userId : req.user.ref;
        const newCard = new Card({
            profileimage: profileimage,
            first_name, last_name, company_name, designation, email, phonecode, phonenumber, country, social_links: JSON.parse(social_links), enable_whatsapp, whatsapp_number, whatsapp_message, userId: userId, isPublished: isPublished
        });
        await newCard.save();
        res.status(200).json({ message: 'Card saved successfully', cardId: newCard._id });
    } catch (error) {
        res.status(500).json({ message: 'Error saving card', error: error.message });
    }
}

const getCards = async (req, res) => {
    try {
        if (req.user.ref === "0") {
            const cards = await Card.find({ userId: req.user.userId.toString() });
            return res.status(200).json({ message: "Cards fetched", cards: cards });
        } else {
            const cards = await Card.find({ userId: req.user.ref.toString() });
            return res.status(200).json({ message: "Cards fetched", cards: cards });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all cards', error: error.message });
    }
}

const getCard = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await Card.findById(id);
        if (!card) {
            return res.status(400).json({ message: 'Card not found' });
        }
        let editor = false;
        let flag = true;
        if (!card.isPublished) {
            if (req.user) {
                if (req.user.userId !== card.userId && req.user.ref !== card.userId) {
                    flag = false; 
                } else {
                    editor = true;
                }
            } else {
                flag = false;
            }
        } else {
            if (req.user) {
                if (req.user.userId === card.userId || req.user.ref === card.userId) {
                    editor = true;
                }
            }
        }
        if (flag) {
            return res.status(200).json({ message: 'Card found successfully', card: card, editor: editor });
        }
        return res.status(400).json({ message: "card is not published", editor: editor })
    } catch (error) {
        res.status(500).json({ message: 'Error fetching card', error: error.message, editor: false });
    }
}

const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await Card.findById(id);
        const oldImagePath = card.profileimage;
        if (oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        await Card.findByIdAndDelete(id);
        res.status(200).json({ message: "Card deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting card', error: error.message });
    }
}

const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, company_name, designation, email, phonecode, phonenumber, country, social_links, enable_whatsapp, whatsapp_number, whatsapp_message, isPublished } = req.body;
        const card = await Card.findById(id);

        if (req.file) {
            const oldImagePath = card.profileimage;
            if (oldImagePath && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            await Card.findByIdAndUpdate(id, {
                profileimage: req.file.path,
                first_name, last_name, company_name, designation, email, phonecode, phonenumber, country, social_links: JSON.parse(social_links), enable_whatsapp, whatsapp_number, whatsapp_message, isPublished: isPublished
            })

        } else {

            await Card.findByIdAndUpdate(id, {
                first_name, last_name, company_name, designation, email, phonecode, phonenumber, country, social_links: JSON.parse(social_links), enable_whatsapp, whatsapp_number, whatsapp_message, isPublished: isPublished
            })

        }
        res.status(200).json({ message: "Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error updating card', error: error.message })
    }
}

module.exports = { saveCard, getCards, getCard, deleteCard, updateCard };