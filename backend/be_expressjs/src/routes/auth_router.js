const express = require('express');
const { AuthService } = require('../services/auth_service.js');

const authRouter = express.Router();

const authService = new AuthService();


authRouter.post('/token', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    let user = await authService.authenticateUser(username, password);
    if (!user) {
      res.status(401)
        .set('WWW-Authenticate', 'Bearer')
        .send("Incorrect username or password")
      return;
    };
    let token = authService.createAccessToken(user.username);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


module.exports = authRouter;
