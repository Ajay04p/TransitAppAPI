const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;

app.get("/getweeklystudents/:route",(req, res) => {
	let route = req.params.route;
	let start = new Date();
 	start.setDate(start.getDate() - 7);
 	let students = [];
 	let date = [];


 	let docs = db.collection('Interim').doc('Spring2019').collection('Routes').doc(route).collection('TripDetails')
	.where("trip_start_time", ">", start).get().then(tripdocs => {
    if (tripdocs.empty) {
      console.log('No matching documents.');
      return res.send("No trip docs found");
    }
    else{
    	tripdocs.forEach(trip=>{
		    students.push(trip.data()['students_arrived']);
		    date.push((trip.data()['trip_start_time']).toDate());
		});
		response = {
			studentsList: students,
			datelist: date
		}
		return res.send(response);
    }
    }).catch(err=>{
		console.log('Error getting documents', err);
		});
});
