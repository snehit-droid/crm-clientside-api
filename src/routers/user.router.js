const express = require("express");
const router = express.Router();
const { insertUser } = require("../model/user/User.model");
const { hashPassword } = require("../helpers/bcrypt.helper");

router.all("/", (req, res, next) => {
    // res.json({ message: "return from user router" });

    next();
});

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

module.exports = router;