const express = require('express');
const Doctors = require('../../models/Doctors');
const Specializations = require('../../models/Specializations');
const sequelize = require('sequelize');
const router = express.Router();
const checkAllAuth = require('../middleware/check-auth-all');


router.get('/', checkAllAuth, async (req, res, next) => {
    if (req.cookies.role === 'doctor') {
        return res.redirect('/api/v1/visits/my');
    }

    const doctors = await Doctors.findAll();
    const jsonDoctors = JSON.stringify(doctors);
    const specializations = await Specializations.findAll();

    return res.format({
        html: () => {
            return res.render('doctors.ejs', {doctors: doctors, specializations: specializations, user: req.cookies.user})
        },
        json: () => {
            return res.status(200).json({
                doctors: jsonDoctors
            });
        }
    });
});

router.get('/:doctorId', checkAllAuth, async (req, res, next) => {
    const id = req.params.doctorId;

    const doctor = await Doctors.findByPk(id);
    const jsonDoctor = JSON.stringify(doctor);

    return res.status(200).json({
        doctor: jsonDoctor
    });
});

router.get('/search/:searchString', checkAllAuth, async (req, res, next) => {
    const searchString = req.params.searchString;

    const doctors = await Doctors.findAll({
        where: {
            [sequelize.Op.or]: [
                {name: {[sequelize.Op.like]: '%' + searchString + '%'}},
                {email: {[sequelize.Op.like]: '%' + searchString + '%'}}
            ]
        }
    });

    const jsonDoctors = JSON.stringify(doctors);

    return res.status(200).json({
        doctors: jsonDoctors
    });
});

module.exports = router;