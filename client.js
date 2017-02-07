displayView = function(nameOfPage){

	var openPage =	document.getElementById(nameOfPage).innerHTML;

	document.getElementById('body').innerHTML = openPage;



 // the code required to display a view
};

function validateSignInForm(event)
{
	console.log('Hejsan');
	event.preventDefault();

	var emailLogIn = document.getElementById('emailLogIn').value;

	var passwordLogIn = document.getElementById('passwordLogIn').value;
	var limitLength = passwordLogIn.length;

	if (limitLength < 5) {
		alert('Lösenordet måste innehålla minst 6 tecken');
	}
	else {
		var loginObject = serverstub.signIn(emailLogIn, passwordLogIn);
		tokenUser = loginObject.data;
		tokenUserSuccess = loginObject.success;

		console.log(tokenUser);
		localStorage.setItem("token", tokenUser);

		if (tokenUserSuccess === false) {
			alert('Wrong password or email');
		}
		else {
			displayView("userView");
			attachHandlersUser();
		}


	}
}

function logOutForm(event) {
	event.preventDefault();
	
	var token = localStorage.getItem("token");

	var logOutCall = serverstub.signOut(token);
	console.log(logOutCall)

	var logOutSuccess = logOutCall.success;

	if (tokenUserSuccess === false) {
		alert(logOutCall.message)
		console.log('Nu loggas du inte ut')
	}
	else {
		alert(logOutCall.message)
		displayView("welcomeView");
		attachHandlersWelcome();
		console.log('Nu loggas du ut')
	}
}

function validateSignUpForm(event)
{
	console.log('HejsanSIGNUP');
	event.preventDefault();

	var password = document.getElementById('password').value;
	var repeatPSW = document.getElementById('repeatPSW').value;
	var firstname = document.getElementById('firstName').value;
	var familyname = document.getElementById('familyName').value;
	var gender = document.getElementById('gender').value;
	var city = document.getElementById('city').value;
	var country = document.getElementById('country').value;
	var email = document.getElementById('email').value;
	var objectSignUp = {email, password, firstname, familyname, gender, city, country};

	var limitLength = password.length;

	if (limitLength < 5) {
		alert('Lösenordet måste innehålla minst 6 tecken');
	}
	else if (repeatPSW !== password) {
		alert('De två lösenorden stämmer inte överens');
	}
	else {
		// var signUpCall = document.getElementById('signUpForm');
		// var formData = new FormData(signUpCall);

		var signUpCall = serverstub.signUp(objectSignUp);
		console.log(objectSignUp);
		console.log(signUpCall);
		//alert(JSON.stringify(signUpCall));
		// JSON.parse(document.getElementById('signUpForm'))
	}

}

function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";

	if(tabName === 'Home'){
		var token = localStorage.getItem("token");
		userInfo = serverstub.getUserDataByToken(token);

		//är detta "snyggare?"
		// var name2 = test2.data.firstname;
		// document.getElementById("firstName").value = name2

		
		document.getElementById("firstName").value = userInfo.data.firstname;
		document.getElementById("familyName").value = userInfo.data.familyname;
		document.getElementById("gender").value = userInfo.data.gender;
		document.getElementById("city").value = userInfo.data.city;
		document.getElementById("country").value = userInfo.data.country;
		document.getElementById("email").value = userInfo.data.email;




	}
}

function validateNewPassForm(event) {
	event.preventDefault();

	var newPass = document.getElementById('newPass').value;
	var repeatNewPass = document.getElementById('repeatNewPass').value;
	var oldPass = document.getElementById('oldPass').value;
	var limitLength = newPass.length;

	if (limitLength < 5) {
		alert('Lösenordet måste innehålla minst 6 tecken');
	}
	else if (newPass != repeatNewPass) {
		alert('De två lösenorden stämmer inte överens');
	}
	else {
		var token = localStorage.getItem("token");


		var changePassCall = serverstub.changePassword(token, oldPass, newPass)
		console.log(changePassCall)



	}
}


function validateHomeForm(event) {
	event.preventDefault();

}


var attachHandlersHome = function() {

	var updateHomeForm = document.getElementById("homeForm");

	if (updateHomeForm !== null) {
		updatePassForm.addEventListener('submit', validateHomeForm);
	}
};

function searchUserForm(event) {
	event.preventDefault();

	var searchUserEmail = document.getElementById("searchUserEmail").value;

	console.log(searchUserEmail)
	var token = localStorage.getItem("token");

	searchUserData = serverstub.getUserDataByEmail(token, searchUserEmail);
	console.log(searchUserData)
	console.log(searchUserData.data.firstname)

	document.getElementById("firstNameSearch").value = searchUserData.data.firstname;
	document.getElementById("familyNameSearch").value = searchUserData.data.familyname;
	document.getElementById("genderSearch").value = searchUserData.data.gender;
	document.getElementById("citySearch").value = searchUserData.data.city;
	document.getElementById("countrySearch").value = searchUserData.data.country;
	document.getElementById("emailSearch").value = searchUserData.data.email;

	updateWall(token, searchUserEmail);
}	

function postMessageForm(event) {
	event.preventDefault();

	var textMessage = document.getElementById("postMessageUser").value;

	console.log(searchUserEmail)
	var token = localStorage.getItem("token");
	var toEmail = document.getElementById("searchUserEmail").value;
	console.log(toEmail)
	var postMessageWall = serverstub.postMessage(token, textMessage, toEmail );
	console.log(postMessageWall.message)
	updateWall(token, toEmail);

}

function updateWall(token, email) {
	event.preventDefault();

	document.getElementById("updateWall").innerHTML = "<b>bold text?</b>";

	theWall = serverstub.getUserMessagesByEmail(token, email);

// for (i = 0; i < cars.length; i++) { 
//     text += cars[i] + "<br>";
// }

var stopCondition = theWall.data.length;

for (i = 0; i < stopCondition; i++) {
	console.log(i)
	var insert = theWall.data[i].content;
	var insertFromUser = theWall.data[i].user;
	// var preInsert = document.getElementById("wallSearch").value;
	// document.getElementById("wallSearch").value += insert;
	console.log(insert)


	if (typeof insert === 'string' || insert instanceof String)
		document.getElementById("updateWall").innerHTML += insert + "<br>";


}

console.log(theWall.data)

}


var attachHandlersUser = function() {

	var updatePassForm = document.getElementById("changePass")
	var logOutPush = document.getElementById("logOut")
	var searchUserPush = document.getElementById("browseUser")
	var postMessage = document.getElementById("postMessage")

	if (searchUserPush != null) {
		searchUserPush.addEventListener('submit', searchUserForm)
	}
	if (updatePassForm != null) {
		updatePassForm.addEventListener('submit', validateNewPassForm);
	}
	if (logOutPush != null) {
		logOutPush.addEventListener('submit', logOutForm);
	}
	if (postMessage != null) {
		postMessage.addEventListener('submit', postMessageForm);
	}
}


var attachHandlersWelcome = function() {

	var logInForm = document.getElementById("logInForm");

	var signUpForm = document.getElementById("signUpForm");



	if (logInForm !== null) {
		logInForm.addEventListener('submit', validateSignInForm);
	}

	if (signUpForm !== null) {
		signUpForm.addEventListener('submit', validateSignUpForm);
	}


};


window.onload = function(){
 //code that is executed as the page is loaded.
 //You shall put your own custom code here.
 //window.alert() is not allowed to be used in your implementation.
 // window.alert("Hello TDDD97!");
 displayView("welcomeView");
 attachHandlersWelcome();

};