const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;

app.get("/getTripDetails/:interim/:route",(req, res) => {
  interim = req.params.interim;
  route = req.params.route;
  bus_number = req.query.bus_number;
  driver_name = req.query.driver_name;

  //let collectionPath = "Interim/"+interim+"/Routes/"+route+"/TripDetails/";
  //TODO: change it later
  let collectionPath = "Routes/"+route+"/Trip Details/";
  console.log(collectionPath)
   myRef = db.collection(collectionPath);
   if(bus_number){
     myRef.where("bus_number","==",bus_number);
   }
   if(driver_name){
     myRef.where("driver_name","==",driver_name);
   }
   let totalStudent = 0;
   myRef.get().then(querySnapshot =>{
     if(querySnapshot.empty){
       return res.send("No record Found");
     }else{
      querySnapshot.forEach(doc =>{
        console.log(doc.data());
      });
      return res.send(totalStudent);
     }
   })
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
