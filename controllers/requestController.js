const Request = require('../models/RequestModel');

const saveRequest = async (req, res) => {
    try {
        const { request } = req.body;
        const userId = req.user.userId;
        const newRequest = new Request({
            request: request,
            userId: userId
        })
        await newRequest.save();
        res.status(200).json({ message: "Request raised", request: newRequest });
    } catch (error) {
        res.status(500).json({ message: "Error while saving the request", error: error.message });
    }
}

const getRequests = async (req, res) => {
    try {
        const userId = req.user.userId;
        const requests = await Request.find({ userId: userId, isResolved: false });
        res.status(200).json({ requests: requests });
    } catch (error) {
        res.status(500).json({ message: "Error while fetching requests", error: error.message });
    }
}

const getRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await Request.findById(id);
        let person = "access";
        if (req.user.userId.toString() === request.userId) {
            person = "sender";
        }
        res.status(200).json({ request: request, person: person });
    } catch (error) {
        res.status(500).json({ message: "Error while fetching requests", error: error.message });
    }
}

const sendChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { msg, person } = req.body;
        const request = await Request.findById(id);
        let chat = [...request.chat];
        chat.push({
            person: person,
            text: msg
        });
        await Request.findByIdAndUpdate(id, {
            chat: chat
        });
        res.status(200).json({ message: "send successfully", chat: chat });
    } catch (error) {
        res.status(500).json({ message: "Error while sending chats", error: error.message });
    }
}

module.exports = { saveRequest, getRequests, getRequest, sendChat };