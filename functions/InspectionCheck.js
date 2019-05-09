const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;


app.get("/GetInspectionCheckList", (req, res) =>{

  console.log("Incoming request with query "+req.query.type);
  let InspectonRef1;
  let response;
  let checkListType = "";
  if(req.query.type && req.query.type.toUpperCase() === 'PRE'){
    checkListType="Pre_Inspection_Check";
    InspectonRef1 = db.collection("Static Data").doc("Pre_Inspection_Check");
  }else if(req.query.type && req.query.type.toUpperCase() === 'POST' ){
    checkListType="Post_Inspection_Check";
    InspectonRef1 = db.collection("Static Data").doc("Post_Inspection_Check");
  }else if(!req.query.type){
    res.status(404).send("Please specify type of checklist");//TODO:
  }
  else{
    return res.status(404).send("The data that you are looking for is not available");//TODO: Need to see proper way to send error
  }
  var getDoc = InspectonRef1.get().then(doc => {
  if (!doc.exists) {
      console.log('No such document!');
      return res.send('No such document!')
    } else {
      //console.log('Document data:', doc.data());
    let subType = [];
    for(type in doc.data()){
      subType.push(type)
    }
    console.log("returned types: "+ subType);
    response = {
      checkListType:checkListType,
      subtype:subType,
      values: doc.data()
    }
    return res.send(response);

    }
  })
  .catch(err => {
    console.log('Error getting document', err);
    return res.send(err);
  });
});


app.post("/addInspectionCheck", (req, res) => {
  console.log("add inspection called", req);
  res.send("Hi..")

});

//
// const GetInspectionCheckList = functions.https.onRequest((req, res) => {
//
//   if(req.method === 'GET'){
//     console.log("Incoming request with query "+req.query.type);
//   var InspectonRef;
//   if(req.query.type.toUpperCase() === 'PRE' ){
//     InspectonRef = db.collection("Static Data").doc("Pre_Inspection_Check");
//   }else if(req.query.type.toUpperCase() === 'POST' ){
//     InspectonRef = db.collection("Static Data").doc("Post_Inspection_Check");
//   }else{
//     return res.send("Invalid options");//TODO: Need to see proper way to send error
//   }
//   var getDoc = InspectonRef.get().then(doc => {
//   if (!doc.exists) {
//       console.log('No such document!');
//       return res.send('No such document!')
//     } else {
//       console.log('Document data:', doc.data());
//       return res.send(doc);
//
//     }
//   })
//   .catch(err => {
//     console.log('Error getting document', err);
//     return res.send(err);
//   });
// }else{
//   return res.status(403).send('Forbidden!');
// }
// });
