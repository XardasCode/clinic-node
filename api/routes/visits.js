const express = require('express');
const Visits = require('../../models/Visits');
const Patients = require('../../models/Patients');
const Doctors = require('../../models/Doctors');
const Specializations = require('../../models/Specializations');
const Statuses = require('../../models/Statuses');
const sequelize = require('sequelize');
const router = express.Router();

const checkDoctorAuth = require('../middleware/check-auth-doctor');
const checkPatientAuth = require('../middleware/check-auth-patient');
const checkAllAuth = require('../middleware/check-auth-all');

router.get('/', checkAllAuth, async (req, res, next) => {
    if (req.cookies.role === 'patient') {
        return res.redirect('/api/v1/visits/my');
    }

    const visits = await Visits.findAll();
    const patients = await Patients.findAll();
    const doctors = await Doctors.findAll();
    const statuses = await Statuses.findAll();

    const jsonVisits = JSON.stringify(visits);

    return res.format({
        html: () => {
            res.render('visits.ejs', {
                visits: visits,
                patients: patients,
                doctors: doctors,
                statuses: statuses,
                user: req.cookies.user
            })
        },
        json: () => {
            res.status(200).json({
                visits: jsonVisits
            });
        }
    })
});

router.get('/my', checkAllAuth, async (req, res, next) => {
    const user = req.cookies.user;
    let visits;
    if (req.cookies.role === 'doctor') {
        visits = await Visits.findAll({where: {doctor_id: user.id}});
    } else {
        visits = await Visits.findAll({where: {patient_id: user.id}});
    }
    const patients = await Patients.findAll();
    const doctors = await Doctors.findAll();
    const statuses = await Statuses.findAll();

    return res.format({
        html: () => {
            return res.render('visits.ejs', {
                visits: visits,
                patients: patients,
                doctors: doctors,
                statuses: statuses,
                user: req.cookies.user
            })
        },
        json: () => {
            return res.status(404).json({
                message: 'Not found'
            });
        }
    })
});

router.get('/:visitId', checkAllAuth, async (req, res, next) => {
    const id = req.params.visitId;

    const Visit = await Visits.findByPk(id);
    const Doctor = await Doctors.findByPk(Visit.doctor_id);
    const Patient = await Patients.findByPk(Visit.patient_id);
    const Status = await Statuses.findByPk(Visit.status_id);
    const Specialization = await Specializations.findByPk(Doctor.specialization_id);
    const jsonVisit = JSON.stringify(Visit);

    const doctorName = Doctor.dataValues.name;

    return res.format({
        html: () => {
            return res.render('visit.ejs', {
                visit: Visit.dataValues,
                user: req.cookies.user,
                doctorName: doctorName,
                patient: Patient.dataValues,
                visitStatus: Status.dataValues,
                specialization: Specialization.dataValues,
                role: req.cookies.role
            })
        },
        json: () => {
            return res.status(200).json({
                visit: jsonVisit
            });
        }
    })
});

router.get('/patient/:patientId', checkAllAuth, async (req, res, next) => {
    const patientId = req.params.patientId;

    const visits = await Visits.findAll({where: {patient_id: patientId}, include: [Patients]});

    const jsonVisits = JSON.stringify(visits);

    return res.status(200).json({
        visits: jsonVisits
    });
});

router.get('/doctor/:doctorId', checkAllAuth, async (req, res, next) => {
    const doctorId = req.params.doctorId;

    const visits = await Visits.findAll({where: {doctor_id: doctorId}, include: [Doctors]});

    const jsonVisits = JSON.stringify(visits);

    return res.status(200).json({
        visits: jsonVisits
    });
});

router.get('/search/:searchString', checkAllAuth, async (req, res, next) => {
    const searchString = req.params.searchString;

    const visits = await Visits.findAll({
        where: {
            [sequelize.Op.or]: [
                {problem: {[sequelize.Op.like]: '%' + searchString + '%'}},
                {treatment: {[sequelize.Op.like]: '%' + searchString + '%'}},
                {diagnosis: {[sequelize.Op.like]: '%' + searchString + '%'}}
            ]
        }
    });

    const jsonVisits = JSON.stringify(visits);

    return res.status(200).json({
        visits: jsonVisits
    });
});

router.get('/new/:doctorId', checkAllAuth, async (req, res, next) => {
    if (req.cookies.role === 'doctor') {
        return res.redirect('/api/v1/visits');
    }
    const doctorId = req.params.doctorId;

    const Doctor = await Doctors.findByPk(doctorId);
    const Specialization = await Specializations.findByPk(Doctor.specialization_id);

    return res.render('create-visit.ejs', {
        user: req.cookies.user,
        doctor: Doctor.dataValues,
        specialization: Specialization.dataValues
    })
});

router.post('/', checkPatientAuth, async (req, res, next) => {
    console.log("POST called");

    const visit = {
        patient_id: req.body.patientId,
        doctor_id: req.body.doctorId,
        problem: req.body.problem,
        date: req.body.date,
        status_id: 1
    };

    console.log(visit);


    if (await !checkDoctorId(visit.doctorId) || await !checkPatientId(visit.patientId)) {
        return res.status(400).json({
            message: 'Doctor or patient does not exist!'
        });
    }

    const newVisit = await Visits.create(visit);

    return res.status(201).json({
        message: 'Created visit!',
        visitId: newVisit.id
    });
});


router.put('/:visitId', checkAllAuth, async (req, res, next) => {
    console.log("PUT called");
    const oldVisit = await Visits.findByPk(req.params.visitId);
    const visit = {
        patient_id: req.body.patientId || oldVisit.patient_id,
        doctor_id: req.body.doctorId || oldVisit.doctor_id,
        problem: req.body.problem || oldVisit.problem,
        date: req.body.date || oldVisit.date,
        treatment: req.body.treatment || oldVisit.treatment,
        diagnosis: req.body.diagnosis || oldVisit.diagnosis,
        status_id: req.body.statusId || oldVisit.status_id
    };

    if (await !checkDoctorId(visit.doctor_id) || await !checkPatientId(visit.patient_id)) {
        return res.status(400).json({
            message: 'Doctor or patient does not exist!'
        });
    }

    const updatedVisit = await Visits.update(visit, {where: {id: req.params.visitId}});

    return res.status(200).json({
        message: 'Updated visit!',
        visitId: updatedVisit.id
    });
});

router.delete('/:visitId', checkPatientAuth, async (req, res, next) => {
    const id = req.params.visitId;

    await Visits.destroy({where: {id: id}});

    return res.status(200).json({
        message: 'Visit deleted!'
    });
});

router.patch('/cancel/:visitId', checkAllAuth, async (req, res, next) => {
    const id = req.params.visitId;

    const visit = await Visits.findByPk(id);

    if (visit.status_id === 1) {
        await Visits.update({status_id: 3}, {where: {id: id}});
        return res.status(200).json({
            message: 'Visit canceled!',
            visitId: visit.id
        });
    } else {
        return res.status(400).json({
            message: 'Visit cannot be canceled!',
            visitId: visit.id
        });
    }
});

router.patch('/in-progress/:visitId', checkDoctorAuth, async (req, res, next) => {
    const id = req.params.visitId;

    const visit = await Visits.findByPk(id);

    if (visit.status_id === 1) {
        await Visits.update({status_id: 4}, {where: {id: id}});
        return res.status(200).json({
            message: 'Visit in progress!',
            visitId: visit.id
        });
    } else {
        return res.status(400).json({
            message: 'Visit cannot be in progress!',
            visitId: visit.id
        });
    }
});

router.patch('/done/:visitId', checkDoctorAuth, async (req, res, next) => {
    const id = req.params.visitId;

    const dbVisit = await Visits.findByPk(id);

    if (dbVisit.status_id === 4) {
        const visitRequest = {
            patient_id: dbVisit.patient_id,
            doctor_id: dbVisit.doctor_id,
            problem: dbVisit.problem,
            date: dbVisit.date,
            diagnosis: req.body.diagnosis,
            treatment: req.body.treatment,
            status_id: 2
        };
        const visit = await Visits.update(visitRequest, {where: {id: id}});
        return res.status(200).json({
            message: 'Visit done!',
            visitId: visit.id
        });
    } else {
        return res.status(400).json({
            message: 'Visit cannot be done!',
            visitId: visit.id
        });
    }
});


const checkDoctorId = async (doctorId) => {
    return await Doctors.findByPk(doctorId);

}

const checkPatientId = async (patientId) => {
    return await Patients.findByPk(patientId);
}

module.exports = router;