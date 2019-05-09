const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;

app.get("/getPreInspectionRecords",(req, res) => {
 console.log("getInspection called with " +req);

 myRef = db.collection("Pre Inspection Check");
 if(req.query.busNo){
   console.log("Record with specific bus number "+ req.query.busNo)
   busNo = Number(req.query.busNo)
   myRef = myRef.where("bus_number","==",req.query.busNo);
 }
 if(req.query.driverName){
   console.log("Record with specific driver name "+ req.query.driverName)
   myRef = myRef.where("driver_name","==",req.query.driverName);
 }
 if(req.query.top){
    top = Number(req.query.top)
    myRef = myRef.orderBy("Timestamp", "desc").limit(top);
 }
 response = {}
 var key = 'InspectionCheckRecord'
 response[key] = []
 response["totalRecords"] = 0

 myRef.get().then(function(querySnapshot) {
    if(querySnapshot.empty){
      console.log("No record found")
      return res.send("No record Found");
    }
     querySnapshot.forEach(function(doc) {
         // doc.data() is never undefined for query doc snapshots
         console.log(doc);
         response["totalRecords"]++;
         response[key].push(doc.data());

     });
     return res.send(response);

 }).catch(err =>{
   return res.send(err);});


 // var getDoc = myRef.get().then(doc => {
 //   console.log(doc);
 // if (!doc.exists) {
 //     console.log('No such document!');
 //     return res.send('No such document!')
 //   } else {
 //     console.log('Document data:', doc.data());
 //     return res.send(doc.data());
 //
 //   }
 // })
 // .catch(err => {
 //   console.log('Error getting document', err);
 //   return res.send(err);
 // });
});
