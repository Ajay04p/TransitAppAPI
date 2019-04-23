const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.GetInspectionCheckList = functions.https.onRequest((req, res) => {

  if(req.method === 'GET'){
    console.log("Incoming request with query "+req.query.type);
  var InspectonRef;
  if(req.query.type.toUpperCase() === 'PRE' ){
    InspectonRef = db.collection("Static Data").doc("Pre_Inspection_Check");
  }else if(req.query.type.toUpperCase() === 'POST' ){
    InspectonRef = db.collection("Static Data").doc("Post_Inspection_Check");
  }else{
    return res.send("Invalid options");//TODO: Need to see proper way to send error
  }
  var getDoc = InspectonRef.get().then(doc => {
  if (!doc.exists) {
      console.log('No such document!');
      return res.send('No such document!')
    } else {
      console.log('Document data:', doc.data());
      return res.send(doc);

    }
  })
  .catch(err => {
    console.log('Error getting document', err);
    return res.send(err);
  });
}else{
  return res.status(403).send('Forbidden!');
}
});
