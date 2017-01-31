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

	var password = document.getElementById('password').value;
	var limitLength = password.length;

	if (limitLength < 5) {
		console.log('Hejsan igen')
		alert("FEEEEL");
	}
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