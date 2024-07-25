const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(403);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authenticateforCard = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
        });
    }
    next();
}

module.exports = { authenticateToken, authenticateforCard };