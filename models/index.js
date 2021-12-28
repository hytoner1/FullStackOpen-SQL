const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Readinglist, as: 'markedBlogs' });
Blog.belongsToMany(User, { through: Readinglist, as: 'usersMarked' });

module.exports = {
  Blog, User, Readinglist
}