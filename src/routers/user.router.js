const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail, getUserById } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { userAuthorization } = require("../middlewares/authorization.middleware");
const { setPasswordResetPin } = require("../model/resetPin/ResetPin.model")

router.all("/", (req, res, next) => {
    // res.json({ message: "return from user router" });

    next();
});

//Get user profile router
router.get("/", userAuthorization, async (req, res) => {
    const _id = req.userId

    const userProf = await getUserById(_id);
    res.json({ user: userProf })
})

//Create new user route
router.post("/", async (req, res) => {
    const { password } = req.body;
    try {
        const hashedPass = await hashPassword(password);
        req.body.password = hashedPass;
        const result = await insertUser(req.body);
        console.log(result);
        res.json({ message: "New user created", result });
    } catch (error) {
        console.log(error);
        res.json({ status:'error', message: error.message });
    }
});

//User sign in Router
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    //get user with email from db
    if(!email || !password){
        return res.json({ status: "error", message: "Invalid form submission!" });
    }

    const user = await getUserByEmail(email);
    //the data related to particular user stored in the db is now catched inside "const user".
    const passFromDb = (user && user._id ? user.password : null);

    if(!passFromDb) return res.json({ status: "error", message: "Invalid email or password" });
    //hash password and compare (using bcrypt.compare) with the DB one.

    const result = await comparePassword(password, passFromDb);

    if(!result){
        return res.json({ status: "error", message: "Password Incorrect" });
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({ status: "success", message: "Login Successfully!", accessJWT, refreshJWT });
})

//A. Create and send password reset pin number
    //1. receive email  *
    //2. check if user exist for the email  *
    //3. create unique 6 digit pin
    //4. save pin and email in the database
    //5. email the pin
    
//B. update password in db
    //1. receive email, pin and new password
    //2. validate pin
    //3. encrypt new password
    //4. update password in db
    //5. send email notification

//C. server side form validation
    //1. create middleware to validate form data

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    const user = await getUserByEmail(email);

    if(user && user._id){
        const setPin = await setPasswordResetPin(email);
        res.json(setPin);
    }

    res.json({status: "error", 
    message: "If the email exist in our database, the password reset pin will be sent shortly"});
})

module.exports = router;