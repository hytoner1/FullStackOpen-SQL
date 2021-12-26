const router = require('express').Router();
const { Op, fn, col } = require('sequelize');

const { Blog } = require('../models');
const { sequelize } = require('../util/db');


router.get('/', async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('count', sequelize.col('id')), 'articles'],
        [sequelize.fn('sum', sequelize.col('likes')), 'likes'],
      ],
      group: ['author']

      //attributes: {
      //  include: [
      //    [fn('COUNT', col('likes')), 'totalLikes']
      //  ]
      //},
      //group: ['author', 'id']
    });
    console.log(JSON.stringify(authors, null, 2))
    res.json(authors);
  }
  catch (e) {
    next(e);
  }
})


module.exports = router;
