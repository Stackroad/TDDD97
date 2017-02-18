var xmlhttp = new XMLHttpRequest();
var data;

displayView = function(nameOfPage){

	var openPage =	document.getElementById(nameOfPage).innerHTML;

	document.getElementById('body').innerHTML = openPage;
};

function validateSignInForm(event) {
	xmlhttp.onreadystatechange = function() {
		console.log('HejsanSIGNUP');
		if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
			data = JSON.parse(xmlhttp.responseText);
			console.log(data.message);
            if (data.success) {
            	console.log(data.success);
                document.getElementById("alertSignUp").innerHTML = "<b>" + data.message + "</b>";
				displayView("userView");
				attachHandlersUser();
                }
                }
		else {
			data = JSON.parse(xmlhttp.responseText);
			document.getElementById("alertSignUp").innerHTML = "<b>" + data.message + "</b>";
                }

        }

	console.log('Hejsan');
	event.preventDefault();

	var emailLogIn = document.getElementById('emailLogIn').value;

	var passwordLogIn = document.getElementById('passwordLogIn').value;
	var limitLength = passwordLogIn.length;

	// if (limitLength < 5) {
	// 	document.getElementById("alertSignIn").innerHTML =
	// 	"<b>Password must contain atleast 6 characters </b>";
	// }
	// else {
	// 	var loginObject = serverstub.signIn(emailLogIn, passwordLogIn);
	// 	tokenUser = loginObject.data;
	// 	tokenUserSuccess = loginObject.success;
    //
	// 	console.log(tokenUser);
	// 	localStorage.setItem("token", tokenUser);
    //
	// 	if (tokenUserSuccess === false) {
	// 		document.getElementById("alertSignIn").innerHTML =
	// 		"<b>Could not sign in</b>";
	// 	}
	// 	else {
	// 		displayView("userView");
	// 		attachHandlersUser();
	// 	}



	var params = "email="+emailLogIn+"&password="+passwordLogIn;
	xmlhttp.open("POST", "/sign_in", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);

	event.preventDefault();
}

function logOutForm(event) {
	event.preventDefault();
	
	var token = localStorage.getItem("token");
	var logOutCall = serverstub.signOut(token);
	var logOutSuccess = logOutCall.success;

	if (tokenUserSuccess === false) {
		
		console.log('Nu loggas du inte ut');
	}
	else {
		
		displayView("welcomeView");
		attachHandlersWelcome();
		console.log('Nu loggas du ut');
	}
}

function validateSignUpForm(event) {
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
				document.getElementById("alertSignUp").innerHTML = "<b>Successfully signed up!</b>";
				displayView("welcomeView");
				attachHandlersWelcome();
                }
		else {
				document.getElementById("alertSignUp").innerHTML = "<b>Feeeel</b>";
				console.log('Da ar vi har');
                }

        }
	var password = document.getElementById('password').value;
	var repeatPSW = document.getElementById('repeatPSW').value;
	var firstname = document.getElementById('firstName').value;
	var familyname = document.getElementById('familyName').value;
	var gender = document.getElementById('gender').value;
	var city = document.getElementById('city').value;
	var country = document.getElementById('country').value;
	var email = document.getElementById('email').value;
	var objectSignUp = {"email":email, "password":password, "firstname":firstname, "familyname":familyname, "gender":gender, "city":city, "country":country};

	var params = "email="+email+"&password="+repeatPSW+"&firstname="+firstname+"&familyname="+familyname+"&gender="+gender+"&city="+city+"&country="+country;
	console.log(objectSignUp)
	xmlhttp.open("POST", "/sign_up", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);

	event.preventDefault();



	// if (limitLength < 5) {
	// 	document.getElementById("alertSignUp").innerHTML =
	// 	"<b>Password must contain atleast 5 characters</b>";
    //
	// }
	// else if (repeatPSW !== password) {
	// 	document.getElementById("alertSignUp").innerHTML =
	// 	"<b>Passwords dont match</b>";
	// }
	// else {
	// 	var signUpCall = serverstub.signUp(objectSignUp);
	// 	console.log(objectSignUp);
	// 	console.log(signUpCall);
	console.log('Nu ar vi har');

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
		xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 & xmlhttp.status == 200) {
			data = JSON.parse(xmlhttp.responseText);
           if (data.success) {
            	console.log(data.success);
				document.getElementById("firstName").value = data.firstname;
				document.getElementById("familyName").value = data.familyname;
				document.getElementById("gender").value = data.gender;
				document.getElementById("city").value = data.city;
				document.getElementById("country").value = data.country;
				document.getElementById("email").value = data.email;
				attachHandlersWelcome();
           }
                }
		else {
				console.log('Da ar vi har');
		}
        }
		var token = localStorage.getItem("token");

		var updateHomeForm = document.getElementById("homeForm");

		updateHomeForm.addEventListener('submit', validateHomeForm);
	}
	var params = "token="+token;
	xmlhttp.open("POST", "/get_user_data_by_token", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
}


function validateNewPassForm(event) {
	event.preventDefault();

	var newPass = document.getElementById('newPass').value;
	var repeatNewPass = document.getElementById('repeatNewPass').value;
	var oldPass = document.getElementById('oldPass').value;
	var limitLength = newPass.length;
	// var passwordLogIn = document.getElementById('passwordLogIn').value;

	if (limitLength < 5) {
		document.getElementById("alertNewPass").innerHTML =
		"<b>Password must contain atleast 6 characters </b>";
	}

	else if (newPass != repeatNewPass) {
		document.getElementById("alertNewPass").innerHTML =
		"<b>New password not repeted correctly</b>";
	}
	else {
		var token = localStorage.getItem("token");
		var changePassCall = serverstub.changePassword(token, oldPass, newPass);
		if (changePassCall === false){
			console.log(changePassCall);
			document.getElementById("alertNewPass").innerHTML =
			"<b>Old password is wrong</b>";
		}
		else {
			document.getElementById("alertNewPass").innerHTML =
			"<b>Password changed</b>";
		}

	}
}


function searchUserForm(event) {
	event.preventDefault();

	var searchUserEmail = document.getElementById("searchUserEmail").value;
	var token = localStorage.getItem("token");

	searchUserData = serverstub.getUserDataByEmail(token, searchUserEmail);

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
	var token = localStorage.getItem("token");
	var toEmail = document.getElementById("searchUserEmail").value;
	var postMessageWall = serverstub.postMessage(token, textMessage, toEmail );
	updateWall(token, toEmail);

}

function updateWall(token, email) {
	event.preventDefault();

	document.getElementById("updateWall").innerHTML = "<b>The Wall <br></b>";

	theWall = serverstub.getUserMessagesByEmail(token, email);


	var stopCondition = theWall.data.length;

	for (i = 0; i < stopCondition; i++) {
		var insert = theWall.data[i].content;
		var insertFromUser = theWall.data[i].user;

		if (typeof insert === 'string' || insert instanceof String)
			document.getElementById("updateWall").innerHTML += "<div id='wallstyleInner'>"+
		"<b>Message"+" " +(stopCondition-i) + "</b>"+"<div>"+
		"<div id='wallstyle'>" +insert +
		"<div> <br>";
	}

}

function refreshWall(token, email) {



	event.preventDefault();
	document.getElementById("updateWallRefresh").innerHTML = "<b>The Wall <br></b>";
	theWall = serverstub.getUserMessagesByEmail(token, email);


	var stopCondition = theWall.data.length;

	for (i = 0; i < stopCondition; i++) {
		var insert = theWall.data[i].content;
		var insertFromUser = theWall.data[i].user;

		if (typeof insert === 'string' || insert instanceof String)
			document.getElementById("updateWallRefresh").innerHTML +=
		"<div id='wallstyleInner'>"+
		"<b>Message"+" " +(stopCondition-i) + "</b>"+"<div>"+
		"<div id='wallstyle'>" +insert +
		"<div> <br>";
	}



}

function validateHomeForm(event) {
	event.preventDefault();

	var emailHome = document.getElementById("email").value;
	var token = localStorage.getItem("token");
	
	refreshWall(token, emailHome);
}


var attachHandlersHome = function() {

	// 	if (refreshWall !== null) {
	// 	refreshWall.addEventListener('submit', updateWall(token, searchUserEmail));
	// }
};

var attachHandlersUser = function() {

	var updatePassForm = document.getElementById("changePass");
	var logOutPush = document.getElementById("logOut");
	var searchUserPush = document.getElementById("browseUser");
	var postMessage = document.getElementById("postMessage");

	if (searchUserPush != null) {
		searchUserPush.addEventListener('submit', searchUserForm);
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
	// if (postMessage != null) {
	// 	postMessage.addEventListener('submit', postMessageForm);
	// }
};


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
	displayView("welcomeView");
	attachHandlersWelcome();

};