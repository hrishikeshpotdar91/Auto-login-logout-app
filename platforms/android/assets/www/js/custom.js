
		 
var emailid;
var firstname;
var lastname;



$('.submit').on('click tap',function(){
    
emailid = $('.email-id').val();

re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
if(emailid == "email@mavs.uta.edu" || !emailid.match(re)){
alert('please enter a valid MAV ID');
}
else if( emailid == "admin@mavs.uta.edu" ) {

	$('.register').hide();
	$('.admin-page').show();


}

else {

$.ajax({  
    type: 'GET',  
    url: 'http://omega.uta.edu/~sxm6532/json.php', 
    data: { email: emailid },
    success: function(response) {
       
       var objlist = JSON.parse(response);

        console.log(objlist.length); 

        for(var i=0;i<objlist.length;i++) {
        	if(objlist[i].email == emailid)
        	{   		
        $('.register').hide();
		$('.enter-password').show();
		$('.enter-password h3').text('We have verified your Mav ID '+emailid);
		localStorage.setItem("email", emailid);
		break;
        	}
        	else
        	{
        		$('.register h3').text('we could not verify your email address');
        	}
        }
        
        

    }
});

}

});



$('.submit-password').on('click tap',function(){

$('.enter-password').hide();
$('.employee-page').show();


var storedEmail = localStorage.getItem("email");
var emailsplit = storedEmail.split('@');
var fullname = emailsplit[0].split('.');
firstname = fullname[0];
lastname = fullname[1];

var emailid = localStorage.getItem("email");
$('.employee-page .welcome').html('Welcome <br />' +firstname + " "+ lastname);
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
$(".sensor").on('click tap',function() {
     $(".sensor p").html($(".sensor p").html() == 'LOGOUT' ? 'LOGIN' : 'LOGOUT');

    if( $(".sensor p").html() === 'LOGOUT')
    {
    	console.log('logout hai');
    	d = new Date();
    	var starttime = d.getHours() + ":" + d.getMinutes();
    	$('.time').text('Stared Work At:' +starttime);
    	
    	
    $.post( "http://omega.uta.edu/~sxm6532/login.php", { name: firstname + " " + lastname, email: localStorage.getItem("email"), logintime: starttime, active: 1 })
  .done(function( data ) {
    console.log( "Data Loaded: " + data );
  });

    }
    if( $(".sensor p").html() === 'LOGIN')
    {
    	f = new Date();
    	console.log('login hai');
    	var endtime = f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
    	
    	var hours = f.getHours() - d.getHours();
    	var minutes = f.getMinutes() - d.getMinutes();
    	var totaltime = hours+":"+minutes;
    	$('.time').html('Finished Work At:' +endtime+ "<br /> Total Hours Worked(h:m:s):"+hours+":"+minutes);

    	$.post( "http://omega.uta.edu/~sxm6532/logout.php", { name: firstname + " " + lastname, email: localStorage.getItem("email"), logouttime: endtime, active: 0 })
  .done(function( data ) {
    console.log( "Data Loaded: " + data );
  });
    	
    }
});	



$.ajax({url: "http://omega.uta.edu/~sxm6532/active.txt", success: function(result){
         
         var activelist = JSON.parse(result);
         var UniqueEmails= $.unique(activelist.active.map(function (d) {return d.email;}));
         
         for(var j=0;j<UniqueEmails.length;j++)
         { 
         var count=0;
         for(var i=0;i<activelist.active.length;i++)
         {
         		
         		if(UniqueEmails[j]==activelist.active[i].email)
         		{
         			if(activelist.active[i].active == 1)
         			{
         				count = count + 1;	
         			}
         			if(activelist.active[i].active == 0)
         			{
         				count = count - 1;	
         			}

         		}

         	}
         	console.log(UniqueEmails[j] + " "+count);
         	$('.active-employees').append('<p>'+UniqueEmails[j]+' <a href="tel:+16822342481">CALL </a>'+'</p>');
         	
         }

         
    }});
