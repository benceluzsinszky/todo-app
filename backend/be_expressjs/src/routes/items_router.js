const express = require('express');
const ItemsService = require('../services/items_service.js');

const itemsRouter = express.Router();

const itemsService = new ItemsService()

const currentUser = {
  id: 1
};

itemsRouter.get('/', async (req, res, next) => {
  try {
    items = await itemsService.getItemsOfUser(currentUser);
    res.json(items);
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message);
  }
});

itemsRouter.post('/', async (req, res, next) => {
  try {
    let item = req.body;
    item.user_id = currentUser.id;
    item = await itemsService.createItem(item);
    res.json(item);
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message);
  }
});

itemsRouter.put('/:id', async (req, res, next) => {
  try {
    let updated_item = req.body;
    updated_item.id = parseInt(req.params.id);
    updated_item.user_id = currentUser.id;
    item = await itemsService.updateItem(updated_item);
    res.json(item);
  } catch (err) {
    console.error(err)
    if (err.name === 'NotFoundError') {
      res.status(404).send(`Item with id ${req.params.id} not found`)
    } else {
      res.status(500).send(err.message);
    }
  }
});

itemsRouter.delete('/:id', async (req, res, next) => {
  try {
    let id = parseInt(req.params.id);
    item = await itemsService.deleteItem(id);
    res.json(item);
  } catch (err) {
    console.error(err)
    if (err.name === 'PrismaClientKnownRequestError') {
      res.status(404).send(`Item with id ${req.params.id} not found`)
    } else {
      res.status(500).send(err.message);
    }
  }
});

module.exports = itemsRouter;
