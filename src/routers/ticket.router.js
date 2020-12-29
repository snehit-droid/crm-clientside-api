const express = require("express");
const router = express.Router();
const { insertTicket } = require("../model/ticket/Ticket.model");

router.all("/", (req, res, next) => {
    // res.json({ message: "return from ticket router" });

    next();
});

//create new ticket
router.post("/", async (req, res) => {
    //recieve new ticket data
    try {
        const { subject, sender, message } = req.body;
    
        const ticketObj = {
            clientId: "5fe4b0047a0d8311c4796d51",
            subject,
            conversations:[
                {
                    sender,
                    message
                }
            ]
        }

        const result = await insertTicket(ticketObj);
        if(result._id){
            return res.json({ status:"success", message:"New Ticket has been created!" });    
        }
        //insert in mongodb
        res.json({ status:"error", message: "Unable to create the ticket, please try again later" });
    } catch (error) {
        res.json({ status:"error", message: error.message });
    }
})

module.exports = router;