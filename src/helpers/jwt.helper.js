const jwt = require('jsonwebtoken');

// const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//In the above inside jwt.sign({shhhhh}) is the secret code we need to provide.

const createAccessJWT = (payload) => {
    const accessJWT = jwt.sign(
        { payload }, 
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' });  //expires in 15 minutes.
    return Promise.resolve(accessJWT);
}

const createRefreshJWT = (payload) => {
    const refreshJWT = jwt.sign(
        { payload }, 
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '30d' });  //expires in 30 days.
    return Promise.resolve(refreshJWT);
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
};