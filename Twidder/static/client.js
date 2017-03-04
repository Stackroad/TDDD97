var xmlhttp = new XMLHttpRequest();
var data;
var socket = new WebSocket('ws://127.0.0.1:5000/socket');
var currentTab;

displayView = function(nameOfPage){
    openPage =	document.getElementById(nameOfPage).innerHTML;
    document.getElementById('body').innerHTML = openPage;
};

socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
};


socket.onopen = function(event) {

};

socket.onmessage = function(event) {
    var message = event.data;
    if (message == 'hastalavista') {
        console.log('TERMINATOR');
        logOutForm(event)
    }
    var data =  JSON.parse(message)
    console.log(data)
    if (data.type == 'stats'){
        message_count = data.posts;
        online_users = data.online;
        searched_user = data.searched;
        console.log(searched_user);
        updateData(message_count, online_users, searched_user);
    }
};

function validateSignInForm(event) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                document.getElementById("alertSignIn").innerHTML = "<b>" + data.message + "</b>";
                localStorage.token = data.token;
                var token = localStorage.getItem('token');
                var obj = {'token':token};
                var send2 = JSON.stringify(obj);
                socket.send(send2);
                displayView("userView");
                initChart()
                attachHandlersUser();

            }
            else {
                document.getElementById("alertSignIn").innerHTML = "<b>" + data.message + "</b>";
            }
        }
    };
    event.preventDefault();

    var emailLogIn = document.getElementById('emailLogIn').value;
    var passwordLogIn = document.getElementById('passwordLogIn').value;
    var params = "email="+emailLogIn+"&password="+passwordLogIn;


    xmlhttp.open("POST", "/sign_in", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function logOutForm(event) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                displayView("welcomeView");
                attachHandlersWelcome();
            }
            else {
                document.getElementById("alertSignIn").innerHTML = "<b>" + data.message + "</b>";
            }
        }
    };
    event.preventDefault();

    var token = localStorage.getItem("token");
    var params = "token="+token;
    localStorage.removeItem('token');
    xmlhttp.open("POST", "/sign_out", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function validateSignUpForm(event) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                document.getElementById("alertSignUp").innerHTML = "<b>" + data.message + "</b>";
                //attachHandlersUser();
            }
            else {
                document.getElementById("alertSignUp").innerHTML = "<b>" + data.message + "</b>";
            }
        }
    };
    event.preventDefault();

    var password = document.getElementById('password').value;
    var repeatPSW = document.getElementById('repeatPSW').value;
    var firstname = document.getElementById('firstName').value;
    var familyname = document.getElementById('familyName').value;
    var gender = document.getElementById('gender').value;
    var city = document.getElementById('city').value;
    var country = document.getElementById('country').value;
    var email = document.getElementById('email').value;
    var password_length = password.length;

    if (password_length < 5) {
        document.getElementById("alertSignUp").innerHTML = "<b>" + 'Password needs to be longer then 5 characters'+ "</b>";
        return false;
    }
    if (repeatPSW != password) {
        document.getElementById("alertSignUp").innerHTML = "<b>" + 'Passwords dont match' + "</b>";
        return false;
    }

    var params = "email="+email+"&password="+repeatPSW+"&firstname="+firstname+"&familyname="+familyname+"&gender="+gender+"&city="+city+"&country="+country;

    xmlhttp.open("POST", "/sign_up", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
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
    currentTab = tabName;

    if (tabName === 'Home') {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var data = JSON.parse(xmlhttp.responseText);
                if (data.success) {
                    document.getElementById("firstName").value = data.firstname;
                    document.getElementById("familyName").value = data.familyname;
                    document.getElementById("gender").value = data.gender;
                    document.getElementById("city").value = data.city;
                    document.getElementById("country").value = data.country;
                    document.getElementById("email").value = data.email;
                    updateFile();
                    attachHandlersWelcome();
                }
            }
            else {

            }
        };
        var updateHomeForm = document.getElementById("homeForm");
        updateHomeForm.addEventListener('submit', validateHomeForm);
        var token = localStorage.getItem("token");
        var params = "token=" + token;



        xmlhttp.open("POST", "/get_user_data_by_token", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(params);
    }
    if (tabName == 'Charts'){


    }

}


function validateNewPassForm(event) {
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                document.getElementById("alertNewPass").innerHTML = "<b>" + data.message + "</b>";
            }
            else {
                document.getElementById("alertNewPass").innerHTML = "<b>" + data.message + "</b>";
            }
        }
        else {
            //document.getElementById("alertNewPass").innerHTML = "<b>" + data.message + "</b>";
        }
    };

    event.preventDefault();

    var newPass = document.getElementById('newPass').value;
    var repeatNewPass = document.getElementById('repeatNewPass').value;
    var oldPass = document.getElementById('oldPass').value;
    var token = localStorage.getItem('token');
    var params = "token=" + token + "&oldPass=" + oldPass + "&newPass=" + newPass + "&repeatNewPass=" + repeatNewPass;

    xmlhttp.open("POST", "/change_password", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

}


function searchUserForm(event) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                document.getElementById("firstNameSearch").value = data.firstname;
                document.getElementById("familyNameSearch").value = data.familyname;
                document.getElementById("genderSearch").value = data.gender;
                document.getElementById("citySearch").value = data.city;
                document.getElementById("countrySearch").value = data.country;
                document.getElementById("emailSearch").value = data.email;
                document.getElementById("alertSearch").innerHTML ='';


                updateFile();
                //updateWall(token, searchUserEmail); //media syns inte nar denna ar med

            }
            else {
                document.getElementById("alertSearch").innerHTML = "<b>" + data.message + "</b>";
            }
        }
    };
    event.preventDefault();
    var searchUserEmail = document.getElementById("searchUserEmail").value;
    var token = localStorage.getItem("token");
    var params = "email="+searchUserEmail+"&token="+token;


    xmlhttp.open("POST", "/get_user_data_by_email", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function postMessageForm(event) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                updateWall(data.token, data.toUser);


            }
            else {

            }
        }
    };
    event.preventDefault();

    var message = document.getElementById("postMessageUser").value;
    var token = localStorage.getItem("token");
    var toUser = document.getElementById("searchUserEmail").value;
    var params = "token="+token+"&message="+message+"&email="+toUser;

    xmlhttp.open("POST", "/post_message", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
}

function updateWall(token, email) {
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                var stopCondition = data.Messages.length;
                for (i = 0; i <= stopCondition; i++) {
                    var insert = data.Messages[stopCondition-i];
                    if (typeof insert === 'string' || insert instanceof String)
                        document.getElementById("updateWall").innerHTML += "<div id='wallstyleInner'>" +
                            "<b>Message" + " " + (stopCondition - i +1) + "</b>" + "<div>" +
                            "<div id='wallstyle'>" + insert +
                            "<div> ";
                }
            }
            else {


            }
        }
    };


    document.getElementById("updateWall").innerHTML = "<b>The Wall <br></b>";
    var params = "token="+token+"&email="+email;
    xmlhttp.open("POST", "/get_user_messages_by_email", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);


}

function refreshWall(token, email) {
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                var stopCondition = data.Messages.length;
                for (i = 0; i <= stopCondition; i++) {
                    var insert = data.Messages[stopCondition-i];

                    if (typeof insert === 'string' || insert instanceof String)
                        document.getElementById("updateWallRefresh").innerHTML +=
                            "<div id='wallstyleInner' draggable='true' ondragstart='drag(event)' >" +
                            "<b>Message" + " " + (stopCondition -i +1) + "</b>" + "<div>" +
                            "<div id='wallstyle' >" + insert + "</div> ";
                }
            }
            else {
            }
        }
    };

    document.getElementById("updateWallRefresh").innerHTML = "<b>The Wall <br></b>";

    var params = "token="+token+"&email="+email;
    xmlhttp.open("POST", "/get_user_messages_by_email", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

}

//
// <img id="drag1" src="img_logo.png" draggable="true"
// 				ondragstart="drag(event)" width="336" height="69">


function validateHomeForm(event) {
    event.preventDefault();

    var emailHome = document.getElementById("email").value;
    var token = localStorage.getItem("token");

    refreshWall(token, emailHome);
}

function uploadFileAction(event) {
    event.preventDefault();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            console.log(data.message);
            if (data.success) {
                updateFile();
            }
        }
        else {
        }
    };
    var formdata = new FormData();
    var file = document.getElementById("fileToUpload").files[0];
    formdata.append("data", file);
    var token = localStorage.getItem("token");
    formdata.append("token",token);


    xmlhttp.open("POST", "/upload_file", true);
    xmlhttp.send(formdata);
}



updateFile = function() {
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                if (data.data[0][1] == "mp4"){
                    if (currentTab == "Browse") {
                        document.getElementById("fileStreamSearch").innerHTML =
                            "<video  width=320 height=240 controls>" +
                            "<source  type=video/mp4 src=\"data:image/" + data.data[0][1] + ";base64," + data.data[0][0] + "\" />"
                            +"</video>"

                    }
                    else {
                        document.getElementById("fileStream").innerHTML =
                            "<video  width=320 height=240 controls>" +
                            "<source  type=video/mp4 src=\"data:image/" + data.data[0][1] + ";base64," + data.data[0][0] + "\" />"
                            + "</video>"
                    }
                }
                else if (data.data[0][1] == "ogg") {
                    if (currentTab == "Browse") {
                        document.getElementById("fileStreamSearch").innerHTML =
                            "<audio controls>" +
                            "<source  type=audio/ogg src=\"data:image/" + data.data[0][1] + ";base64," + data.data[0][0] + "\" />"
                            + "</audio>"
                    }
                    else {

                        document.getElementById("fileStream").innerHTML =
                            "<audio controls>" +
                            "<source  type=audio/ogg src=\"data:image/" + data.data[0][1] + ";base64," + data.data[0][0] + "\" />"
                            + "</audio>"
                    }
                }
                else {
                    if (currentTab == "Browse") {
                        document.getElementById("fileStreamSearch").innerHTML =
                            "<img src=\"data:image/" + data.data[0][1] + ";base64," + data.data[0][0] + "\" />";
                    }
                    else{
                    } document.getElementById("fileStream").innerHTML =
                        "<img src=\"data:image/" + data.data[0][1] + ";base64," + data.data[0][0] + "\" />";
                }
            }
        }
        else {
            document.getElementById("fileStream").innerHTML = "<b>Mottagit en updateFile func FAIL <br></b>";
        }
    };
    var params;
    if (currentTab == 'Home'){
        var token = localStorage.getItem("token");
         params = "token="+token;
        xmlhttp.open("POST", "/get_file", true);
    }
    else {
        var email = document.getElementById("emailSearch").value;
         params = "email="+email;
        xmlhttp.open("POST", "/get_file_by_email", true);
    }


    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
};

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
    var uploadFile = document.getElementById("uploadFileForm");

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
    if (uploadFile != null) {
        uploadFile.addEventListener('submit', uploadFileAction);
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

    if (localStorage.getItem('token') == null) {
        displayView("welcomeView");

        attachHandlersWelcome();
    }

    else {
        displayView("userView");
        attachHandlersUser();
    }


};

