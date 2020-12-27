const jwt = require('jsonwebtoken');
const {setJWT, getJWT} = require('./redis.helper');
const {storeUserRefreshJWT} = require("../model/user/User.model");

// const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
//In the above inside jwt.sign({shhhhh}) is the secret code we need to provide.

const createAccessJWT = async (email, _id) => {
    //"email" is sent as the payload.
    try {
        const accessJWT = await jwt.sign(
            { email }, 
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' });  //expires in 15 minutes.
    
        await setJWT(accessJWT, _id)    
    
        return Promise.resolve(accessJWT);
    } catch (error) {
        return Promise.reject(error);
    }
}

const createRefreshJWT = async (email, _id) => {
    try {
        const refreshJWT = jwt.sign(
            { email }, 
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' });  //expires in 30 days.
    
        await storeUserRefreshJWT(_id, refreshJWT)    
            
        return Promise.resolve(refreshJWT);
    } catch (error) {
        return Promise.reject(error);
    }    
}

const verifyAccessJWT = (userJWT) => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET));
    } catch (error) {
        return Promise.resolve(error)
    }
};

const verifyRefreshJWT = (userJWT) => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET));
    } catch (error) {
        return Promise.resolve(error)
    }
};

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    verifyAccessJWT,
    verifyRefreshJWT,
};