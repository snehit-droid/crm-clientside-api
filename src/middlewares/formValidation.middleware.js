const Joi = require("joi");

const email = Joi.string()
                .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } 
});

const pin = Joi.string().min(6).max(6).required();

const newPassword = Joi.string()
.alphanum()
.min(3)
.max(30)
.required();       
//alphanum, min(3), max(30) means should be "alpha numeric, min of 3 and max of 30 charlength and is requiered."

const resetPassReqValidation = (req, res, next) => {

    const schema = Joi.object({ email })

    const value = schema.validate(req.body)
    if(value.error){
       return res.json({status:"error", message: value.error.message});
    }
    next();
};

const updatePassValidation = (req, res, next) => {

    const schema = Joi.object({ email, pin, newPassword });

    const value = schema.validate(req.body)
    if(value.error){
       return res.json({status:"error", message: value.error.message});
    }
    next();
};

module.exports = {
    resetPassReqValidation,
    updatePassValidation,
}