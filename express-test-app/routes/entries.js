const express = require('express');
const router = express.Router();
const Query = require('contensis-management-api').Query;
const Op = require('contensis-management-api').Op;
const uuidv4 = require('uuid/v4');

const entries_list = require('../examples/entries').entries_list;

router.get('/', async function (req, res, next) {

  try {
    let client = res.app.get('client');

    let result = await entries_list(client, 'simpleContent');
    let entries = result.items;

    res.render('entries', { title: 'Project entries:', entries: entries });

  } catch (error) {
    res.render('entries', { title: 'Error' });
  }

});

module.exports = router;
