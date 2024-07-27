const express = require('express');
const dotenv = require("dotenv");
const dbConfig = require('./config/dbConfig');
const cors = require('cors');
dotenv.config();
const path = require('path');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middlewares/auth');
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/card", require("./routes/cardRoute"));
app.use("/api/dashboard", require('./routes/dashboardRoute'));
app.use("/api/request", require('./routes/requestRoute'));

app.get('/api/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});

const port = process.env.PORT;
const uri = process.env.URI;
dbConfig(uri);
app.listen(port, () => {
    console.log("Server started at 5000");
})