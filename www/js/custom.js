var emailid;
var firstname;
var lastname;
var workhours = new Array();
var lat1;
var lon2; 
var lat2 = 32.871535099999996;
var lon2 = -96.9454753;
var distance;
var watchID;

$('.submit').on('click tap', function() {

    emailid = $('.email-id').val();

    re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (emailid == "email@mavs.uta.edu" || !emailid.match(re)) {
        alert('please enter a valid MAV ID');
    } else if (emailid == "admin@mavs.uta.edu") {

        $('.register').hide();
        $('.admin-page').show();


    } else {

        $.ajax({
            type: 'GET',
            url: 'http://omega.uta.edu/~sxm6532/json.php',
            data: {
                email: emailid
            },
            success: function(response) {

                var objlist = JSON.parse(response);

                console.log(objlist.length);

                for (var i = 0; i < objlist.length; i++) {
                    if (objlist[i].email == emailid) {
                        $('.register').hide();
                        $('.enter-password').show();
                        $('.enter-password h3').text('We have verified your Mav ID ' + emailid);
                        localStorage.setItem("email", emailid);
                        break;
                    } else {
                        $('.register h3').text('we could not verify your email address');
                    }
                }



            }
        });

    }

});



$('.submit-password').on('click tap', function() {

    $('.enter-password').hide();
    $('.employee-page').show();


    var storedEmail = localStorage.getItem("email");
    var emailsplit = storedEmail.split('@');
    var fullname = emailsplit[0].split('.');
    firstname = fullname[0];
    lastname = fullname[1];

    var emailid = localStorage.getItem("email");
    $('.employee-page .welcome').html('Welcome <br />' + firstname + " " + lastname);
    console.log(emailid);

});

/*
if(localStorage.getItem("email"))
{
var storedEmail = localStorage.getItem("email");
var emailsplit = storedEmail.split('@');
var fullname = emailsplit[0].split('.');
var firstname = fullname[0];
var lastname = fullname[1];
$('.employee-page .welcome').html('<p>Welcome, <br />' +firstname + " "+ lastname+"</p>");
$('.register').hide();	
$('.enter-password').hide();
$('.employee-page').show();

}
*/


var d;
var f;
$(".sensor").on('click tap', function() {
    $(".sensor p").html($(".sensor p").html() == 'LOGOUT' ? 'LOGIN' : 'LOGOUT');

    if ($(".sensor p").html() === 'LOGOUT') {
       

        if (distance < 1)
        {
        	console.log('you can log in');
        	d = new Date();
        var starttime = d.getHours() + ":" + d.getMinutes();
        $('.time').text('Stared Work At:' + starttime);


        $.post("http://omega.uta.edu/~sxm6532/login.php", {
                name: firstname + " " + lastname,
                email: localStorage.getItem("email"),
                logintime: starttime,
                active: 1
            })
            .done(function(data) {
                console.log("Data Loaded: " + data);
            });


        }
        else {

        	console.log('cannot log in'+ distance);
        	$('.ErrMsg').text("Are you sure you're inside the building?");
        }
        

    }
    if ($(".sensor p").html() === 'LOGIN') {
        f = new Date();
        console.log('login hai');
        var endtime = f.getHours() + ":" + f.getMinutes();

        var hours = f.getHours() - d.getHours();
        var minutes = f.getMinutes() - d.getMinutes();
        var totaltime = hours + ":" + minutes;
        $('.time').html('Finished Work At:' + endtime + "<br /> Total Hours Worked(h:m:s):" + hours + ":" + minutes);

        $.post("http://omega.uta.edu/~sxm6532/logout.php", {
                name: firstname + " " + lastname,
                email: localStorage.getItem("email"),
                logouttime: endtime,
                active: 0
            })
            .done(function(data) {
                console.log("Data Loaded: " + data);
            });

    }
});

// list of active employees

$.ajax({
    url: "http://omega.uta.edu/~sxm6532/active.php",
    success: function(result) {

        var activelist = JSON.parse(result);
        var UniqueEmails = $.unique(activelist.active.map(function(d) {
            return d.email;
        }));

        for (var j = 0; j < UniqueEmails.length; j++) {
            var count = 0;
            for (var i = 0; i < activelist.active.length; i++) {

                if (UniqueEmails[j] == activelist.active[i].email) {
                    if (activelist.active[i].active == 1) {
                        count = count + 1;
                    }
                    if (activelist.active[i].active == 0) {
                        count = count - 1;
                    }

                }

            }
            
            if (count == 1) {

            	 $('.active-employees').append('<p>' + UniqueEmails[j] + ' <a href="tel:+16822342481">CALL </a>' + '</p>');
               
            }


        }

    }
});


// call function

$.ajax({
    url: "http://omega.uta.edu/~sxm6532/json.php",
    success: function(result) {

    	var userlist = JSON.parse(result);
    	
    	for (var i=0;i<userlist.length;i++)
    	{
    		$( ".active-employees p" ).each(function() {
    			var email = $(this).text();
    			email = email.split(" ");
    			email = email[0];
    			
    			var useremail = userlist[i];
    			

    			if(useremail.email == email)
    			{
    				$(this).html('<p>' + useremail.email + ' <a href="tel:'+useremail.phoneno+'">CALL </a>' + '</p>');
    			}
    			
});
    	}
    }
});


// salary and total hours
$.ajax({
    url: "http://omega.uta.edu/~sxm6532/active.php",
    success: function(result) {
    var activelist = JSON.parse(result);
    
    var users = $.unique(activelist.active.map(function(d) {
            return d.email;
        }));
    
    for(var j=0;j<users.length;j++)
    {
    	var starttime;
    	var endtime;
    	var totalhours;
    	var totalminutes;
    	var salary;
    	

    for(var i=0; i< activelist.active.length;i++)
    {
    	
    	var userlog = activelist.active[i];
    	
    	if(users[j] == userlog.email && userlog.active == "1")
    	{
    		starttime = userlog.logintime;
    		starttime = starttime.split(":");
    		loginhours = starttime[0];
    		loginminutes = starttime[1];
    			
    	}
    	if(users[j] == userlog.email && userlog.active == "0")
    	{
    		endtime = userlog.logouttime;
    		endtime = endtime.split(":");
    		logouthours = endtime[0];
    		logoutminutes = endtime[1];
    	    		
    	}
    }
   
    if(parseInt(loginhours) > parseInt(logouthours))
    {
    	totalhours = (parseInt(logouthours) + 24) - parseInt(loginhours);
    	salary = parseInt(totalhours) * 9;
    }
    else {
    	totalhours = parseInt(logouthours) - parseInt(loginhours);
    	salary = parseInt(totalhours) * 9;
    }
    
    workhours.push({"EmployeeName":users[j],"HoursWorkedToday":totalhours,"TodaySalary":salary});
}
    sendlist = JSON.stringify(workhours);
    console.log(sendlist);
    }

});

var options = {
	enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0

}

if (typeof(Number.prototype.toRadians) === "undefined") {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  }
}

function success(pos){
	var crd = pos.coords;

// lat long 1 = current position	
  lat1 = crd.latitude;
  lon1 = crd.longitude;

console.log(lat1 + "" + lon1);


var φ1 = lat1.toRadians(), φ2 = lat2.toRadians(), Δλ = (lon2-lon1).toRadians(), R = 6371000; // gives d in metres
distance = Math.acos( Math.sin(φ1)*Math.sin(φ2) + Math.cos(φ1)*Math.cos(φ2) * Math.cos(Δλ) ) * R;

console.log(distance);
}

function error() {

	console.log('nahi hua');
}

navigator.geolocation.getCurrentPosition(success, error, options);

function errorHandler(err) {
            if(err.code == 1) {
               alert("Error: Access is denied!");
            }
            
            else if( err.code == 2) {
               alert("Error: Position is unavailable!");
            }
         }


function getLocationUpdate(){
            if(navigator.geolocation){
               // timeout at 60000 milliseconds (60 seconds)
               var options = {timeout:60000};
               geoLoc = navigator.geolocation;
               watchID = geoLoc.watchPosition(success, errorHandler, options);
               console.log("SET watchid "+watchID);
            }
            else{
               alert("Sorry, browser does not support geolocation!");
            }
}


function clearLocationUpdate() {

navigator.geolocation.clearWatch(watchID);
console.log("CLEAR watchid "+watchID);

}


