const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;

app.get("/preInspectionIssues",(req, res) => {

  let start = new Date();
  start.setMonth(start.getMonth() - 1);
  console.log(start);
  let issues = 0;

  let preInspectionDocs = db.collection('Pre Inspection Check');

  var query = preInspectionDocs.where("Timestamp", ">", start).get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return res.send('No such document!');
    }

    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      let dict = Object.assign(doc.data()['checks']['Engine_Checks'], doc.data()['checks']['Exterior_Checks'], doc.data()['checks']['Interior_Checks']);
      let answers = Object.values(dict);
      answers.forEach(value=>{
      		if(!value){
      			issues++;
      		}
      });
    });
    console.log(issues);
    issues = String(issues);
    return res.send(issues)
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });

});


app.get("/postInspectionIssues",(req, res) => {


  let start = new Date();
  start.setMonth(start.getMonth() - 1);
  console.log(start);
  let issues = 0;
    let postInspectionDocs = db.collection('Post Inspection Check');
    var query = postInspectionDocs.where("Timestamp", ">", start).get()
    .then(snapshot => {
    if (snapshot.empty) {
      return res.send('No such document!');
    }

    snapshot.forEach(doc => {
      // console.log(doc.id, '=>', doc.data());
      let dict = Object.assign(doc.data()['checks']['FuelAndOtherProblems'], doc.data()['checks']['PostTripChecks']);
      let answers = Object.values(dict);
      answers.forEach(value=>{
          if(!value){
            issues++;
          }
      });
    });
    console.log(issues);
    issues = String(issues);
    return res.send(issues);
  })
  .catch(err => {
    console.log('Error getting documents', err);
    return res.send(err);
  });

});