const express = require('express');
const router = express.Router();
const Query = require('contensis-management-api').Query;
const Op = require('contensis-management-api').Op;
const uuidv4 = require('uuid/v4');

const contentTypes_list = require('../examples/contentTypes').contentTypes_list;

router.get('/', async function (req, res, next) {

  try {
    let client = res.app.get('client');

    let contentTypes = await contentTypes_list(client);

    res.render('contentTypes', { title: 'Project content types:', contentTypes: contentTypes });

  } catch (error) {
    res.render('contentTypes', { title: 'Error' });
  }

});

module.exports = router;
