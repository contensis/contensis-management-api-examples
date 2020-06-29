const express = require('express');
const router = express.Router();
const Query = require('contensis-management-api').Query;
const Op = require('contensis-management-api').Op;
const uuidv4 = require('uuid/v4');

const projects_list = require('../examples/projects').projects_list;

/* GET home page. */
router.get('/', async function (req, res, next) {

  try {

    let client = res.app.get('client');

    let projects = await projects_list(client);

    res.render('index', { title: 'Current projects:', projects: projects });

  } catch (error) {
    res.render('index', { title: 'Error' });
  }

});

module.exports = router;
