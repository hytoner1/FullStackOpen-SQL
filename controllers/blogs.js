const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models');

const { SECRET } = require('../util/config')


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(' ');
      console.log(' ');
      const decodedToken = jwt.verify(authorization.substring(7), SECRET);
      console.log(' ');
      console.log(' ');
      console.log('TOKEN:', decodedToken);
      req.decodedToken = decodedToken;
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  });
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

router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body, userId: user.id, date: new Date()
    });
    return res.json(blog);
  } catch (e) {
    next(e);
  }
})

router.delete('/:id', [tokenExtractor, blogFinder], async (req, res) => {
  if (req.blog) {
    if (req.blog.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'Only one\'s own posts can be deleted!' });
    }
    await req.blog.destroy();
  }
  res.status(204).end()
})

module.exports = router;
