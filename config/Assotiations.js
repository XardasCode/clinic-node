const Status = require('../models/Statuses');
const Specialization = require('../models/Specializations');
const Visit = require('../models/Visits');
const Patient = require('../models/Patients');
const Doctor = require('../models/Doctors');

Specialization.hasMany(Doctor, {
    foreignKey: {
        name: 'specialization_id',
        allowNull: false
    }
});

Doctor.belongsTo(Specialization, {
    foreignKey: {
        name: 'specialization_id',
        allowNull: false
    }
});

Status.hasMany(Visit, {
    foreignKey: {
        name: 'status_id',
        allowNull: false
    }
});

Visit.belongsTo(Status, {
    foreignKey: {
        name: 'status_id',
        allowNull: false
    }
});

Patient.hasMany(Visit, {
    foreignKey: {
        name: 'patient_id',
    }
});

Visit.belongsTo(Patient, {
    foreignKey: {
        name: 'patient_id',
    }
});

Doctor.hasMany(Visit, {
    foreignKey: {
        name: 'doctor_id',
    }
});

Visit.belongsTo(Doctor, {
    foreignKey: {
        name: 'doctor_id',
    }
});

module.exports = {}


