// require('dotenv').config();
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

const app = express();
dotenv.config();
const port = process.env.SERVER_PORT; // default port to listen
app.use("/api", route);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import route from "./ripple";
// define a route handler for the default home page
app.get( "/", ( req: any, res: any ) => {
    res.send( "Hello world!" );
} );


const db = "mongodb://localhost:27017/test1";
mongoose.connect(db , {useCreateIndex: true, useNewUrlParser: true})
    .then((res: any) => {
          // tslint:disable-next-line:no-console
        console.log("***CONGRATS FOR MongoDB CONNECTION***");
    } )
    .catch((err: any) => {
          // tslint:disable-next-line:no-console
        console.error("***DATABASE NOT CONNECTED***");
    } );

// start the Express server
app.listen( port, () => {
     // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
