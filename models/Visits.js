const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');


const Visits = sequelize.define('visits', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    problem: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    treatment: {
        type: DataTypes.STRING
    },
    diagnosis: {
        type: DataTypes.STRING
    }
});

Visits.sync().then(() => {
    console.log('Table and model Visits are synchronized successfully.');
}).catch((err) => {
    console.log('An error has occurred with table Visits:', err);
});

module.exports = Visits;