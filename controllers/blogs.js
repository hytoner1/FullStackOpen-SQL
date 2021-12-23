const router = require('express').Router();

const { Blog } = require('../models');


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
}


router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs);
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  if (req.blog) {
    try {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      res.json(req.blog);
    }
    catch (e) {
      next(e);
    }
  } else {
    res.status(204).end()
  }
})

router.post('/', async (req, res, next) => {
  console.log(req.body);
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  }
  res.status(204).end()
})

module.exports = router;