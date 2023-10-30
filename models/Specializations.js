const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Specializations = sequelize.define('specializations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

Specializations.sync().then(() => {
    console.log('Table and model Specializations are synchronized successfully.');
}).catch((err) => {
    console.log('An error has occurred with table Specialization:', err);
});

module.exports = Specializations;
