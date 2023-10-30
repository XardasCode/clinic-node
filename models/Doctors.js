const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Doctors = sequelize.define('doctors', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    }, {
        timestamps: false,
    }
);

Doctors.sync().then(() => {
    console.log('Table and model Doctors are synchronized successfully.');
}).catch((err) => {
    console.log('An error has occurred with table Doctors:', err);
});

module.exports = Doctors;