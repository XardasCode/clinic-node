const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');


const Statuses = sequelize.define('statuses', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    }
});

Statuses.sync().then(() => {
    console.log('Table and model Statuses are synchronized successfully.');
}).catch((err) => {
    console.log('An error has occurred with table Statuses:', err);
});

module.exports = Statuses;
