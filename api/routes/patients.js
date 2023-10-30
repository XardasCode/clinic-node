const express = require('express');
const Patients = require('../../models/Patients');
const router = express.Router();
const checkAllAuth = require('../middleware/check-auth-all');

router.get('/', checkAllAuth, async (req, res, next) => {
    const patients = await Patients.findAll();
    const jsonPatients = JSON.stringify(patients);

    res.status(200).json({
        patients: jsonPatients
    });
});

router.get('/:patientId', checkAllAuth, async (req, res, next) => {
    const id = req.params.patientId;

    const patient = await Patients.findByPk(id);
    const jsonPatient = JSON.stringify(patient);

    res.status(200).json({
        patient: jsonPatient
    });
});

router.get('/search/:searchString', checkAllAuth, async (req, res, next) => {
    const searchString = req.params.searchString;

    const patients = await Patients.findAll({
        where: {
            [sequelize.Op.or]: [
                {name: {[sequelize.Op.like]: '%' + searchString + '%'}},
                {email: {[sequelize.Op.like]: '%' + searchString + '%'}}
            ]
        }
    });

    const jsonPatients = JSON.stringify(patients);

    res.status(200).json({
        patients: jsonPatients
    });
});

module.exports = router;