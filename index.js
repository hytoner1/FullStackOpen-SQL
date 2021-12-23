const express = require('express');
const app = express();
app.use(express.json())

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
app.use('/api/blogs', blogsRouter)

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  });
}

start();

//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({
//  extended: true
//}));
//app.use(bodyParser.json());
