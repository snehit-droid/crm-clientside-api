const express = require("express");
const router = express.Router();
const { insertTicket, getTickets } = require("../model/ticket/Ticket.model");
const { userAuthorization } = require("../middlewares/authorization.middleware");

router.all("/", (req, res, next) => {
    // res.json({ message: "return from ticket router" });

    next();
});

//create new ticket
router.post("/", userAuthorization, async (req, res) => {
    //recieve new ticket data
    try {
        const { subject, sender, message } = req.body;

        const userId = req.userId;
    
        const ticketObj = {
            clientId: userId,
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
});

//Get all tickets for a specific user
router.get("/", userAuthorization, async (req, res) => {
    //recieve new ticket data
    try {
        const userId = req.userId;

        const result = await getTickets(userId);
        
        return res.json({ status: "success", result }); 
    
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

module.exports = router;