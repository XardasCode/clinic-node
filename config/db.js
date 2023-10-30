const Sequelize = require('sequelize');

const sequalize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: 'aws.connect.psdb.cloud',
    port: 3306,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        },
    },
    define: {
        timestamps: false,
    }
});

sequalize.authenticate().then(() => {
    console.log('Connection has been established successfully.');

}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequalize;