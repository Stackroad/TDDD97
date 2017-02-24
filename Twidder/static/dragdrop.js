/**
 * Created by Mattias on 2017-02-22.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {

    var message = (ev.target.innerHTML.split('wallstyle">'));
    var test = message[1].split('</div');
    var realMessage = test[0];
    ev.dataTransfer.setData("Text", realMessage);

}


function drop(ev) {
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var data = JSON.parse(xmlhttp.responseText);
            if (data.success) {
                token = localStorage.getItem('token');
                refreshWall(token, email)
            }
            else {

            }
        }
    };
    ev.preventDefault();

    var message = ev.dataTransfer.getData('Text');
    console.log('Deleted message: ' + message);

    var email = document.getElementById("email").value;
    var params = "message="+message+"&email="+email;

    xmlhttp.open("POST", "/delete_message", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);

}