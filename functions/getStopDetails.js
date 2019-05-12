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
          return res.send("No Stops Found");
        }else{
          querySnapshot.forEach(doc =>{
            //console.log(doc.data());
            if(doc.id in routeMap){
              index = routeMap[doc.id];
              routeMap[doc.id] = doc.data();
              routeMap[doc.id].index = index;
            }
          });

          return res.send(routeMap);
        }
      }).catch(err => {
        console.log(err)
        return res.send(err);
      });
    }

    //just to remove the // WARNING:
    return

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
    return res.send("Something went wrong");

  }).catch(err =>{
    console.log(err);
    res.send(err);
  });

});

app.get("/getSchedule/:interim/:route",(req, res)=> {
  interim = req.params.interim;
  route = req.params.route;
  let collectionPath = "Interim/"+interim+"/Routes/"+route+"/Schedule/";
  console.log("getSchedule called with " +interim +" and route" + route);
  currentTime = req.query.current_time;
  weekDay = req.query.week_day;

  myRef = db.collection(collectionPath);
  if(currentTime){
    range = getRange(currentTime);
    myRef = myRef.where("time","<=",range[1]).where("time",">=",range[0]);
    console.log(range);
  }
  if(weekDay){
    weekDay = convertToWeekType(weekDay)
    myRef = myRef.where("week_type", "==",weekDay);
    console.log(weekDay);
  }
  possibleSchedule = []
  myRef.get().then(querySnapshot =>{
    if(querySnapshot.empty){
      console.log("empty");
      return res.send("No data found");
    }else{
      querySnapshot.forEach(doc =>{
        data = doc.data();
        data['time'] = convertStringToTime(data['time']);
        possibleSchedule.push(data);
      });
      return res.send(possibleSchedule)
    }
  }).catch(err=>{
    console.log(err);
    return res.send(err);

  });
});

function convertToWeekType(week_day){
  //week_days = {'monday':0,'tuesday':1,'wednesday':2,'thursday':3,'friday':4,'saturday':5,'sunday':6}
  //week_day = week_days[week_day]
  if(week_day <= 4){
    return 'Weekday';
  }else if(week_day === 5){
    return 'Saturday';
  }else if(week_day === 6){
    return 'Sunday';
  }else{
    //TODO throw error
    return 'Error';
  }
}

const getRange = (time=>{
  let cover = 200
  time = Number(time.replace(":",""))
  time1= time-cover
  if(time1 < 0){
    time1 = 0
  }

  time2 = time+cover
  if(time2 > 2359){
    time2=2359
  }
  return [Number(time1),Number(time2)];
});

const convertStringToTime = (time => {
  time = time.toString();
  return time.substr(0,time.length - 2)+":"+ time.substr(-2);
});


app.get("/testing",(req,res)=>{
  response = {
    field1: 50,
    field2:"stringValue",
  }
  res.send(response);
  return;
})
