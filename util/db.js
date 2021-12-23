const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const connectToDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.log('Connecting database failed');
    return process.exit(1);
  }

  return null;
}

module.exports = { connectToDatabase, sequelize };
