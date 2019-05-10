const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;

app.get("/getStops/:interim/:route",(req, res) => {
  interim = req.params.interim;
  route = req.params.route;
  console.log("getStops called with " +interim);
  let collectionPath = "Interim/"+interim+"/Routes";
  let routeIds = []
  db.collection(collectionPath).doc(route).get().then(doc => {
  if (!doc.exists) {
      console.log('No such document!');
      return res.send('No such document!')
    } else {
      routeMap = {}
      index = 0;
      routeIds = doc.data()['stops'].forEach(id=>{
          routeMap[id]=index++;
      });

      db.collection("Stops").where("routes", "array-contains", route)
      .get().then(querySnapshot =>{
        if(querySnapshot.empty){
          res.send("No Stops Found");
        }else{
          querySnapshot.forEach(doc =>{
            //console.log(doc.data());
            if(doc.id in routeMap){
              index = routeMap[doc.id];
              routeMap[doc.id] = doc.data();
              routeMap[doc.id].index = index;
            }
          });

          res.send(routeMap);
        }
      });
    }
  }).catch(err =>{
    console.log(err);
  });
});


app.get("/getAllRoutes/:interim",(req,res)=>{
  let interim = req.params.interim;
  //let collectionPath = "Interim/"+interim+"/Routes"
  //TODO: need to fetch the data from database
  // console.log("getAllRoutes called with "+ interim);
  // db.collection(collectionPath).get().then(x=>{
  //   console.log(x);
  //   res.send(404)
  // })
  let collectionPath = "Stops"
  allRoutes = {};
  db.collection(collectionPath).get().then(querySnapshot => {
    if(querySnapshot.empty){
      console.log("No data found");
      res.send("No Data Found");
    }else{
      querySnapshot.forEach(doc =>{
        doc.data().routes.forEach(route =>{
          console.log(route)
          if(route in allRoutes){
            allRoutes[route]++;
          }else{
            allRoutes[route] = 1;
          }
        })
      });
      return res.send(allRoutes);
    }
    //return res.send(allRoutes);

  })

});

app.get("/getSchedule/:interim/:route",(req, res)=> {
  interim = req.params.interim;
  route = req.params.route;
  let collectionPath = "Interim/"+interim+"/Routes/"+route+"/Schedule/";
  console.log("getSchedule called with " +interim +" and route" + route);
  currentTime = req.params.

  myRef = db.collection(collectionPath);


  myRef.get().then(querySnapshot =>{
    if(querySnapshot.empty){
      console.log("empty");
    }else{
      querySnapshot.forEach(doc =>{

      });
    }
  });
  res.send("Regards, \n Ajay Pal")
});
app.get("/testing",(req,res)=>{
  response = {
    field1: 50,
    field2:"stringValue",
  }
  res.send(response);
  return;
})
