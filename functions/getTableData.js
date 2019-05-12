const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;
const firestore = init.admin.firestore
app.get("/getTableDetails/:route/:date/:schedule",(req, res) => {
	let route = req.params.route;
	let time = req.params.date;
	let schedule = req.params.schedule;
	let d = new Date(time);
	console.log(d);
	
	let d1 = new Date();
	// d1.setYear(d.getYear());
	// d1.setMonth(d.getMonth());
	d1.setDate(d.getDate() + 1);
	console.log(d1);

	let driverName = [];
	let busNo = [];
	let stopName = [];
	let studentsArrived = [];
	let studentsDeparted = [];
	let racksLoaded = [];
	let racksUnloaded = [];

	let docs = db.collection('Interim').doc('Spring2019').collection('Routes').doc(route).collection('TripDetails')
	.where("trip_start_time", ">", d).where("trip_start_time", "<", d1).where("schedule", "==", schedule).get().then(tripdocs => {
		if (tripdocs.empty) {
			console.log('No matching documents.');
			return res.send("No trip docs found");
		}
		else{
			// console.log(tripdocs);
			tripdocs.forEach(trip=>{
				// let stop = trip.data()['stop'];
				driverName.push(trip.data()['driver_name']);
				busNo.push(trip.data()['bus_number']);
				stopName.push(trip.data()['stop']);
				studentsArrived.push(trip.data()['students_arrived']);
				studentsDeparted.push(trip.data()['students_departed']);
				racksLoaded.push(trip.data()['racks_loaded']);
				racksUnloaded.push(trip.data()['racks_unloaded']);
				});

			response = {
				// trip_date: date,
				driver_name: driverName,
				bus_no: busNo,
				trip_stop: stopName,
				trip_students_arrived: studentsArrived,
				trip_students_departed: studentsDeparted,
				trip_racks_loaded: racksLoaded,
				trip_racks_unloaded: racksUnloaded
			};
			return res.send(response);
		}

	})
	.catch(err=>{
		console.log('Error getting documents', err);
		return;
		});

});