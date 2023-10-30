const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token;
        if (req.cookies.token === undefined) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            token = req.cookies.token;
        }

        req.userData = jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (error) {
        return res.format({
            html: function () {
                res.redirect('/api/v1/auth');
            },
            json: function () {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
        })
    }

}