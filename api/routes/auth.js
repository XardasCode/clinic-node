const express = require('express');
const Doctors = require('../../models/Doctors');
const Patients = require('../../models/Patients');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res, next) => {
    res.format({
        html: () => {
            if (req.cookies.token) {
                return res.redirect('/api/v1/visits/my');
            } else {
                res.render('login.ejs');
                return;
            }
        },
        json: () => {
            res.status(404).json({
                message: 'Not found'
            });
        }
    })
});

router.get('/register', async (req, res, next) => {
    res.format({
        html: () => {
            res.render('register.ejs');
            return;
        },
        json: () => {
            return res.status(404).json({
                message: 'Not found'
            });
        }
    })
});

router.post('/signup', async (req, res, next) => {
    const loginUser = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    };

    console.log("name: " + loginUser.name + " email: " + loginUser.email + " password: " + loginUser.password);

    const checkPatient = await Patients.findOne({
        where: {
            email: loginUser.email
        }
    });

    if (checkPatient) {
        return res.status(409).json({
            message: 'User with this email already exists'
        });
    }

    bcrypt.hash(loginUser.password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        }

        const patient = await Patients.create({
            name: loginUser.name,
            email: loginUser.email,
            password: hash
        });

        return res.status(201).json({
            patientId: patient.id
        });
    });
})

router.post('/login', async (req, res, next) => {
    const loginUser = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    };

    let user;

    if (loginUser.role === 'doctor') {
        user = await Doctors.findOne({
            where: {
                email: loginUser.email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
    } else {
        user = await Patients.findOne({
            where: {
                email: loginUser.email
            }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
    }
    await bcrypt.compare(loginUser.password, user.password, async (err, result) => {
        if (err) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }

        if (result) {
            const token = await jwt.sign({
                email: user.email,
                userId: user.id,
                role: loginUser.role,
            }, process.env.JWT_KEY, {
                expiresIn: "1h"
            });
            await res.cookie('token', token);
            await res.cookie('user', user);
            await res.cookie('role', loginUser.role);
            return res.status(200).json({
                message: 'Auth successful',
                user: user,
                role: loginUser.role,
                token: token
            });
        } else {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
    });

});

router.get('/logout', async (req, res, next) => {
    await res.clearCookie('token');
    await res.clearCookie('user');
    return res.redirect('/api/v1/auth');
});

module.exports = router;