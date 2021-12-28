const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { Blog, User, Readinglist } = require('../models');

const { SECRET } = require('../util/config')

router.get('/', async (req, res) => {
  const readinglists = await Readinglist.findAll({
  });
  console.log(JSON.stringify(readinglists, null, 2))
  res.json(readinglists);
});

router.post('/', async (req, res, next) => {
  console.log(req.body);
  try {
    const readinglist = await Readinglist.create(req.body);
    return res.json(readinglist);
  } catch (e) {
    next(e);
  }
})

module.exports = router;
