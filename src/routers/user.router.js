const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");

router.all("/", (req, res, next) => {
    // res.json({ message: "return from user router" });

    next();
});

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
    console.log(result);

    res.json({ status: "success", message: "Login Successfully!" });
})

module.exports = router;