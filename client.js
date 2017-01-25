displayView = function(nameOfPage){

	var openPage =	document.getElementById(nameOfPage).innerHTML;
// console.log(openPage);

document.getElementById('body').innerHTML = openPage;


 // the code required to display a view
};

function validateForm(event)
{
	console.log('Hejsan');
	event.preventDefault();
    // Validate email
    var email = document.getElementById('email').value;
    // if ((/(.+)@(.+){2,}\.(.+){2,}/.test(email)) || email=="" || email==null) { } else {
    // 	alert("Please enter a valid email");
    // }
}

var attachHandlersWelcome = function() {

	var logInForm = document.getElementById("logInForm")

	if (logInForm != null) {
		logInForm.addEventListener('submit', validateForm);
	}
}
window.onload = function(){
 //code that is executed as the page is loaded.
 //You shall put your own custom code here.
 //window.alert() is not allowed to be used in your implementation.
 // window.alert("Hello TDDD97!");
 displayView("welcomeView");
 attachHandlersWelcome();

};