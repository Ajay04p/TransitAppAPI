const init = require('./init.js')
const inpsection = require('./InspectionCheck.js')
const inpsectionRecords = require('./InspectionCheckRecord.js')
const tripDetails = require('./getTripDetails.js')
const getBusDetails = require('./getStopDetails.js')
const getIssuesCount = require('./getMonthlyIssues.js')
const getMonthlyStudents = require('./getMonthlyStudentsCount.js')
const getWeeklyStudents = require('./getWeeklyStudentsPerRoute.js')
const getTableData = require('./getTableData.js')

functions = init.functions;
app = init.app;
app.get("/",(r,re) =>{
  list_api = {
    getStops: "/getStops/:interim/:route",
    getAllRoutes:"/getAllRoutes/:interim",
    getSchedule:"/getSchedule/:interim/:route",
    getTripDetails:"/getTripDetails/:interim/:route" ,
    getInspectionCheckList: "/GetInspectionCheckList",
    getPreInspectionRecords:"/getPreInspectionRecords",
    getPreInspectionIssues:"/preInspectionIssues",
    getPostInspectionIssues:"/getPostInspectionIssues",
    getWeeklyStudentsPerRoute: "/getweeklystudents/:route",
    getMonthlyStudentsCount:"/monthlystudents",
    getTableData:"/getTableDetails/:route/:date/:schedule"

  }
  re.send(list_api);
  init.firebase.initializeApp();
});

const api = functions.https.onRequest(init.app);
module.exports={
api
}
