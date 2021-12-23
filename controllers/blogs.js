const router = require('express').Router();

const { Blog, User } = require('../models');


const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      res.status(401).json({ error: 'token invalid' });
    }
  } else {
    res.status(401).json({ error: 'token missing' });
  }
  next();
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: user,
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
    const user = await User.findOneByPk(req.decodedToken.id);
    const blog = await Blog.create({
      ...req.body, userId: user.id, date: new Date()
    });
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
