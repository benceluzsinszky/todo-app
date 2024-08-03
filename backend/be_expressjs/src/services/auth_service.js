const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const UsersService = require('../services/users_service.js');

const usersService = new UsersService();

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const ALGORITHM = process.env.HASHING_ALGORITHM;


class AuthService {

    createAccessToken(username) {
        return jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1800s' });
    };

    verifyPassword(plain_password, hashed_password) {
        return bcrypt.compare(plain_password, hashed_password);
    };

    async authenticateUser(username, password) {
        let user;
        try {
            user = await usersService.getUser(username);
        } catch (err) {
            console.error(err);
            return false;
        } if (!this.verifyPassword(password, user.password)) {
            return false;
        }
        return user;
    };

    async getCurrentUser(token) {
        const payload = jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] });
        const username = payload.username;
        if (!username) {
            throw Error;
        }
        const user = await usersService.getUser(username);
        if (!user) {
            throw Error;
        }
        return user;
    };
};


// Authentication middleware

const authService = new AuthService();

const getCurrentUserMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send("No token provided");
    };

    try {
        const user = await authService.getCurrentUser(token);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send("Could not validate credentials")
    };
};

module.exports = { AuthService, getCurrentUserMiddleware };