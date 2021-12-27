const Sequelize = require('sequelize');
const { DATABASE_URL } = require('./config');
const Umzug = require('umzug');

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const runMigrations = async () => {
  const migrator = new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize,
      tableName: 'migrations',
    },
    migrations: {
      params: [sequelize.getQueryInterface()],
      path: `${process.cwd()}/migrations`,
      pattern: /\.js$/,
    },
  })
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.file),
  })
}

const connectToDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Running migrations...');
    await runMigrations();
    console.log('Ready');
  } catch (err) {
    console.log('Connecting database failed');
    return process.exit(1);
  }

  return null;
}

module.exports = { connectToDatabase, sequelize };
