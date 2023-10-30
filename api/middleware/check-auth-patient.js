const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("Called middleware");
    try {
        let token;
        if (req.cookies.token === undefined) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            token = req.cookies.token;
        }
        req.userData = jwt.verify(token, process.env.JWT_KEY);
        if (req.userData.role !== 'patient') {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        console.log(req.userData);
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }

}