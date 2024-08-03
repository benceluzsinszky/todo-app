const express = require('express');
const ItemsService = require('../services/items_service.js');

const itemsRouter = express.Router();

const itemsService = new ItemsService();


itemsRouter.get('/', async (req, res, next) => {
  try {
    items = await itemsService.getItemsOfUser(req.user);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

itemsRouter.post('/', async (req, res, next) => {
  let item = req.body;
  item.user_id = req.user.id;
  try {
    item = await itemsService.createItem(item);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

itemsRouter.put('/:id', async (req, res, next) => {
  let updatedItem = req.body;
  updatedItem.id = parseInt(req.params.id);
  updatedItem.user_id = req.user.id;
  try {
    item = await itemsService.updateItem(updatedItem);
    res.json(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'NotFoundError') {
      res.status(404).send(`Item with id ${req.params.id} not found`);
      return;
    }
    res.status(500).send(err.message);
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  let id = parseInt(req.params.id);
  try {
    item = await itemsService.deleteItem(id);
    res.json(item);
  } catch (err) {
    console.error(err);
    if (err.name === 'PrismaClientKnownRequestError') {
      res.status(404).send(`Item with id ${req.params.id} not found`);
      return;
    }
    res.status(500).send(err.message);
  }
});

module.exports = itemsRouter;
