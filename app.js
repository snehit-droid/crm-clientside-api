require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

//API Security
app.use(helmet());

//handle CORS error
app.use(cors());

//Mongodb connection Setup
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}); /*the above (inside of mongoose.connect) is as per the documentation, followed. 
if not mentioned, it might throw some errors*/

if(process.env.NODE_ENV !== "production") {
    // (executes if not in production)
    const mDb = mongoose.connection;
    mDb.on("open", () => {
        console.log("MongoDB is connected");
    }); //checks if the mongo is connected or not.
    mDb.on("error", (error) => {
        console.log(error);
    }); //logs if there is any error.

    //Logger
    app.use(morgan("tiny"));
}

//Set body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Load Routers
const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
const tokensRouter = require("./src/routers/tokens.router");

//Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);
app.use("/v1/tokens", tokensRouter);
//everytime the "/v1/user" request it redirects to userRouter.

//Error handler
const handleError = require("./src/utils/errorHandler")

app.use("*", (req, res, next) => {
    // res.json({ message: "Resources are not found!" });
    const error = new Error("Resources not found!");
    error.status = 404;
    next(error);
});
//"*" if there is no matching route. no "*" in the below code is also same as having "*".

app.use((error, req, res, next) => {
    handleError(error, res);
})

app.listen(port, () => {
    console.log(`API is ready on http://localhost:${port}`);
})