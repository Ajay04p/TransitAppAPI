const init = require('./init.js')
var db = init.admin.firestore();
var app = init.app;

app.get("/monthlystudents",(req, res) => {
	let start = new Date();
	start.setMonth(start.getMonth() - 1);
	console.log(start);
	let students = 0;
	let bikeracks = 0;
	let checkcallbacks = [];
	let routes = db.collection('Interim').doc('Spring2019').collection('Routes').get()
	.then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      res.send('No Routes found');
    }
    else{
    	routeSize = snapshot.size;
    	console.log("routesize : ", routeSize);
	    snapshot.forEach(route => {
	    	console.log(route.id);
	    	db.collection('Interim').doc('Spring2019').collection('Routes').doc(route.id).collection('TripDetails')
	    	.where("time", ">", start).get().then(tripdocs=>{
	    		if(tripdocs.empty){
	    			console.log('No matching documents.');
	    			res.send("No docs found");
	    		}
	    		else{
	    			// var len = Array.from(tripdocs).length;
	    			// console.log(Array.from(tripdocs));
	    			console.log(tripdocs);
	    			let len = tripdocs.size;
	    			console.log("length=", len);
	    			temp = 0;
		    		tripdocs.forEach(trip=>{
		    			temp++;
		    			console.log(route.id, trip.id, len);
		    			students = students + trip.data()['students_arrived'];
		    			bikeracks = bikeracks + trip.data()['racks_loaded'];
		    			if(temp===len){
		    				checkcallbacks.push(true);
		    			}
		    		});
		    		
		  			console.log(students, bikeracks, checkcallbacks.length);
		  			if(checkcallbacks.length==routeSize){
		    				response = {
			    			totalstudents: students,
			    			totalracks: bikeracks,
			  				}
			    			return res.send(response);
		    			}
	    			return;
	    		}

	    	})
	    	.catch(err=>{
	    		console.log('Error getting documents', err);
	    		return;
	    	});
	    });
	    
   }
  })
  .catch(err => {
    console.log('Error getting documents', err);
    return;
  });
});