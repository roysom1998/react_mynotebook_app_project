var jwt = require('jsonwebtoken');
const JWT_SECRET = 'ThisIsASecret';
const fetchUsers = (req, res, next) => {

    //checking for commit
    //getting the user for the jwt token and adding id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Token is not valid" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Token is not valid" });
    }
}
module.exports = fetchUsers;