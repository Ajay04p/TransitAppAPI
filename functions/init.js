const admin = require('firebase-admin');
const functions = require('firebase-functions');
admin.initializeApp(functions.config().firebase);


const express  = require("express");
const app = express();
const cors = require('cors');
app.use(cors({origin:true}));
module.exports= {
  app,admin, functions
}
