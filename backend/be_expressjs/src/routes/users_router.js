const express = require('express');
const UsersService = require('../services/users_service.js');

const usersRouter = express.Router();

const usersService = new UsersService()

const currentUser = {
  id: 1
};

usersRouter.get('/me', async (req, res, next) => {
  return currentUser;
});

usersRouter.post('/', async (req, res, next) => {
  let user = req.body;
  if (!user.username || !user.password) {
    res.status(400).send("Username and password are required");
    return;
  }
  try {
    user = await usersService.createUser(user);
    res.json(user);
  } catch (err) {
    console.error(err);
    if (err.name === 'PrismaClientKnownRequestError') {
      res.status(409).send("User already exists");
      return;
    }
    res.status(500).send(err.message);
  }
});

usersRouter.put('/me', async (req, res, next) => {
  try {
    let updatedUser = req.body;
    user = await usersService.updateUser(currentUser, updatedUser);
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

usersRouter.delete('/me', async (req, res, next) => {
  try {
    user = await usersService.deleteUser(currentUser);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

module.exports = usersRouter;
