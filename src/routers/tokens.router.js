const express = require("express");
const router = express.Router();
const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../model/user/User.model");

router.get("/", async (req, res, next) => {
    const { authorization } = req.headers;
    //1. make sure the token is valid
    const decoded = await verifyRefreshJWT(authorization);
    if(decoded.email){
        const userProf = await getUserByEmail(decoded.email);
        if(userProf._id) {
            let tokenExp = userProf.refreshJWT.addedAt;
            const dBrefreshToken = userProf.refreshJWT.token;
            tokenExp = tokenExp.setDate(tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY);
            //everything coming from the environment (.env) is of "string" form need to convert into "int"
            const today = new Date();

            if(dBrefreshToken !== authorization || tokenExp < today){
                //expired
                return res.status(403).json({ message: "Forbidden, token expired" });
            }

            const accessJWT = await createAccessJWT(decoded.email, userProf._id.toString());

            //delete old token from the redis db


            return res.json({ status: "success", accessJWT });
        }
    }
    //2. check if the jwt is exist in database.
    //3. check if it is not expired.
    res.status(403).json({ message: "Forbidden" });
});

module.exports = router;