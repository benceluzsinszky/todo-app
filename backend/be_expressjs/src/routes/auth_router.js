const express = require('express');
const { AuthService } = require('../services/auth_service.js');

const authRouter = express.Router();

const authService = new AuthService();


authRouter.post('/token', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authService.authenticateUser(username, password);
    if (!user) {
      res.status(401)
        .set('WWW-Authenticate', 'Bearer')
        .send("Incorrect username or password")
      return;
    };
    const access_token = authService.createAccessToken(user.username);
    const tokenResponse = {
      access_token: access_token,
      token_type: "bearer"
    };
    res.json(tokenResponse);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


module.exports = authRouter;
