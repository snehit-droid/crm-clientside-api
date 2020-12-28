const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJwT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) return res.status(403).json({message: "Forbidden"}); 
    
    //1. verify if jwt is valid
    const  decoded = await verifyAccessJWT(authorization);
    if(decoded.email){
        const userId = await getJWT(authorization);
        if(!userId) {
            return res.status(403).json({message: "Forbidden"});
        }
        req.userId = userId;
        return next();
    }

    deleteJwT(authorization)

    return res.status(403).json({message: "Forbidden"});
    //2. check if jwt is exist in redis
    //3. extract user id
    //4. get user profile based on the user id

};

module.exports = {
    userAuthorization,
};