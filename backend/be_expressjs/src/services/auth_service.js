const bcrypt = require('bcrypt');

class AuthService {

    verifyPassword(plain_password, hashed_password) {
        return bcrypt.compare(plain_password, hashed_password);
    };

};

module.exports = AuthService;