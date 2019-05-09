const init = require('./init.js')
const inpsection = require('./InspectionCheck.js')
const inpsectionRecords = require('./InspectionCheckRecord.js')
const tripDetails = require('./getTripDetails.js')
const getBusDetails = require('./getStopDetails.js')
functions = init.functions;
app = init.app;
app.get("/",(r,re) =>{
  re.send("Welcome to Transit API");
});
const api = functions.https.onRequest(init.app);
module.exports={
api
}
