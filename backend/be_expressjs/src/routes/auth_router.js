const express = require('express');

const authRouter = express.Router();

/* GET users listing. */
authRouter.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

module.exports = authRouter;

