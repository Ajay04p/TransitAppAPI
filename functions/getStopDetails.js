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

      db.collection("Stops").where("routes", "array-contains", route).get().then(querySnapshot =>{
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
      })
    }
  }).catch(err =>{
    console.log(err);
  });
});

app.get("/testing",(req,res)=>{
  response = {
    field1: 50,
    field2:"stringValue",
  }
  res.send(response);
  return;
})
