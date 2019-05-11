const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;
const firestore = init.admin.firestore
app.get("/getTripDetails/:interim/:route",(req, res) => {
  interim = req.params.interim;
  route = req.params.route;
  bus_number = req.query.bus_number;
  driver_name = req.query.driver_name;
  stats_type = req.query.stats_type;
  stop_code = req.query.stop_code;
  schedule_code = req.query.schedule_code;
  //database strings;
  let students_arrived = 'students_arrived';
  let racks_loaded = 'racks_loaded';
  let total_student = 0;
  let total_racks = 0;
  //let collectionPath = "Interim/"+interim+"/Routes/"+route+"/TripDetails/";
  //TODO: change it later
  let collectionPath = "Routes/"+route+"/Trip Details/";
  console.log(collectionPath)
   myRef = db.collection(collectionPath);
   if(bus_number){
     myRef = myRef.where("bus_number","==",bus_number);
   }
   if(driver_name){
     myRef = myRef.where("driver_name","==",driver_name);
   }
   if(stop_code){
     myRef = myRef.where("stop_code","==",stop_code);
   }
   if(schedule_code){
      myRef = myRef.where("schedule_code","==",schedule_code);
   }

   //TODO: date range
   //last week
   if(stats_type){
     if(stats_type === 'lw'){
       res.send(new Date());
       return;
     }
   }
   var date1 = new Date('April 17, 2019 02:02:51')
   console.log(date1)
   myRef = myRef.where("trip_start_time",">=", date1);
   myRef.get().then(querySnapshot =>{
     if(querySnapshot.empty){
       return res.send("No record Found");
     }else{
      // querySnapshot.forEach(doc =>{
      //   total_student+=Number(doc.data()[students_arrived]);
      //   total_racks+=Number(doc.data()[racks_loaded]);
      //   timeStamp = doc.data()['trip_start_time'];
      //   x = timeStamp.toDate()
      //   console.log(x)
      //   x.setDate(x.getDate()-3);
      //   console.log(x);
      // console.log("Hello")
      // res.send("hello");
      //
      // })
      //return res.send("hellow")
      response ={
        total_student: total_student,
        total_racks:total_racks
      };
      return res.send(response);
     }
   }).catch(err =>{
     console.log(err)
     return res.send(err);
   });
  // myRef = db.collection(collectionPath).doc("taAO3zwDgrM6dojoknpt").get().then(doc => {
  // if (!doc.exists) {
  //     console.log('No such document!');
  //     return res.send('No such document!')
  //   } else {
  //     return res.send(doc.data());
  //   }
  // }).catch(err =>{
  //   console.log(err);
  // });
});
