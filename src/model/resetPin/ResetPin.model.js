const { ResetPinSchema } = require("./ResetPin.schema");
const { randomPinNumber } = require("../../utils/randomGenerator");

const setPasswordResetPin = async (email) => {
    const pinLength = 6;
    const randPin = await randomPinNumber(pinLength);

    const resetObj = {
        email,
        pin : randPin
    }

    return new Promise((resolve, reject) => {
        ResetPinSchema(resetObj)
            .save()
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
};

module.exports = {
    setPasswordResetPin,
};