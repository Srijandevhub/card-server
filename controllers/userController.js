const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET;
const fs = require('fs');

const signup = async (req, res) => {
    try {
        const { name, companyname, designation, email, phonecode, phonenumber, country, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const image = req.file ? req.file.path : null;
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            image : image,
            name : name,
            companyname: companyname,
            jobtitle : designation,
            email : email,
            phonecode : phonecode,
            phonenumber : phonenumber,
            country : country,
            password : hashpassword
        });
        await newUser.save();
        res.status(200).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
}

const addUser = async (req, res) => {
    try {
        const { name, email, phonecode, phonenumber, country, password, cardmanagement, cardmanagementCreate, cardmanagementEdit, cardmanagementDelete, cardmanagementShare, usermanagement, umcreate, umedit, umdel } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name : name,
            email : email,
            phonecode : phonecode,
            phonenumber : phonenumber,
            country : country,
            password : hashpassword,
            ref: req.user.ref === "0" ? req.user.userId : req.user.ref,
            modules: {
                cardmanagement: cardmanagement,
                cardmanagementaccess: {create: cardmanagementCreate, delete: cardmanagementDelete, share: cardmanagementShare, edit: cardmanagementEdit},
                usermanagement: usermanagement,
                usermanagementaccess: {create: umcreate, delete: umdel, edit: umedit}
            },
            firstLogin: true
        });
        await newUser.save();
        res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user', error: error });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email, ref: user.ref }, JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: 'Logged in successfully', userid: user._id});
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

const getUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(400).json({ message: "user cannot be fetched" });
        }

        const userid = jwt.decode(token).userId;
        const user = await User.findById(userid);

        res.status(200).json({ user });
        
    } catch (error) {
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
}

const getSelectedUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json({ message: "User Fetched successfully", user: user });
    } catch (error) {
        res.status(500).json({ message: 'Error getting user', error: error.message });
    }
}

const getUsers = async (req, res) => {
    try {
        let ref;
        if (req.user.ref !== "0") {
            ref = req.user.ref;
        } else {
            ref = req.user.userId;
        }
        const users = await User.find({ ref: ref });
        const filteredUsers = users.filter(user => user._id.toString() !== req.user.userId);
        res.status(200).json({ message: "All users fetched", users: filteredUsers});
    } catch (error) {
        res.status(500).json({ message: 'Error getting users', error: error.message });
    }
}


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phonecode, phonenumber, country, cardmanagement, cardmanagementCreate, cardmanagementEdit, cardmanagementDelete, cardmanagementShare, usermanagement, umcreate, umedit, umdel } = req.body;
        
        await User.findByIdAndUpdate(id, {
            name : name,
            email : email,
            phonecode : phonecode,
            phonenumber : phonenumber,
            country : country,
            modules: {
                cardmanagement: cardmanagement,
                cardmanagementaccess: {create: cardmanagementCreate, delete: cardmanagementDelete, share: cardmanagementShare, edit: cardmanagementEdit},
                usermanagement: usermanagement,
                usermanagementaccess: {create: umcreate, delete: umdel, edit: umedit}
            }
        });
        res.status(200).json({ message: 'User updated successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error });
    }
}

const removeProfileImage = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        const oldImagePath = user.image;
        if (oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        await User.findByIdAndUpdate(userId, {
            image: null
        });
        res.status(200).json({ message: 'Profileimage removed successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Error removing image', error: error.message });
    }
}

const updateSingleUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, companyname, designation, email, phonecode, phonenumber, country  } = req.body;
        const user = await User.findById(userId);
        if (req.file) {
            const oldImagePath = user.image;
            if (oldImagePath && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            const image = req.file.path;
            await User.findByIdAndUpdate(userId, {
                image: image,
                name : name,
                companyname: companyname,
                jobtitle : designation,
                email : email,
                phonecode : phonecode,
                phonenumber : phonenumber,
                country : country
            })
        } else {
            await User.findByIdAndUpdate(userId, {
                name : name,
                companyname: companyname,
                jobtitle : designation,
                email : email,
                phonecode : phonecode,
                phonenumber : phonenumber,
                country : country
            })
        }
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

const firstLogin = async (req, res) => {
    try {
        const { currPassword, newPassword } = req.body;
        const user = await User.findOne({ email: req.user.email });
        const validCurrpassword = await bcrypt.compare(currPassword, user.password);
        if (!validCurrpassword) {
            return res.status(400).json({ message: "Current password not matched" });
        }
        const hashpassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(req.user.userId, {
            firstLogin: false,
            password: hashpassword
        });
        res.clearCookie('token');
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error });
    }
}

module.exports = { signup, login, logout, getUser, addUser, getUsers, getSelectedUser, updateUser, firstLogin, removeProfileImage, updateSingleUser, deleteUser };