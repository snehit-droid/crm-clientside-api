const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//     },
// });

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.E_MAIL,
        pass: process.env.PASSWORDD,
    },
});

const send = (info) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await transporter.sendMail(info);
    
            console.log("Message sent: %s", result.messageId);
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            
              // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... 
            resolve(result);

        } catch (error) {
            console.log(error);
        }
    })
}

const emailProcessor = ({ email, pin, type }) => {
    let info = '';
    switch (type) {
        case "request-new-password":
            info = {
                from: '"TS Company" <bernhard.larson@ethereal.email>', // sender address
                to: email,  //"bar@example.com, baz@example.com", // list of receivers
                subject: "Password reset Pin", // Subject line
                text: "Here is your password reset pin" +pin+ "This pin will expire in 1 day", // plain text body
                html: `<b>Hello </b>
                Here is your pin
                <b>${pin}</b>
                This pin will expire in 1 day
                <p></p>`, // html body
            };
        
            send(info);
            break;
        case "update-password-success":
            info = {
                from: '"TS Company" <bernhard.larson@ethereal.email>', // sender address
                to: email,  //"bar@example.com, baz@example.com", // list of receivers
                subject: "Password Updated", // Subject line
                text: "Your new Password has been updated", // plain text body
                html: `<b>Hello </b>
                <p>Your new Password has been updated</p>`, // html body
            };
        
            send(info);
            break;
        default:
            break;
    }
    
};

module.exports = { emailProcessor };