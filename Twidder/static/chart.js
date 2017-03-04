/**
 * Created by Mattias on 2017-03-03.
 */

var myChart;
var counter = 0;
//Chart.defaults.global.responsive = true;
//Chart.defaults.global.maintainAspectRatio = false;


//"Date: " + time.getDate()+ "/" +time.getMonth() +

function updateData(message_count, online_users, searched_user){
    var time = new Date();
    var dateTime = " Time: "+ time.getHours() +":"+ time.getMinutes();

    myChart.data.datasets[0].data[counter] = message_count;
    myChart.data.datasets[1].data[counter] = online_users;
    myChart.data.datasets[2].data[counter] = searched_user;
    myChart.data.labels[counter] = dateTime;

    myChart.update();
    counter = counter +1;
}


function initChart() {
    var option = {
        showLines: true,
        animation : false,
        scaleOverride : true
    };
    var data = {
        labels: ["Posts", "Users online", "Searched user"],
        datasets: [
            {
                label:"Posts",
                fill: false,
                data: [],
                backgroundColor : "#ff5f46",
                borderColor : "#ff5f46",


            },
            {
                label:"Online users",
                fill: false,
                data: [],
                backgroundColor : "#8dff41",
                borderColor : "#8dff41"


            },
            {
                label:"Searched user",
                fill: false,
                data: [],
                backgroundColor : "#5775ff",
                borderColor : "#5775ff"

            }
        ]
    };
    var ctx = document.getElementById("myChart");
    myChart = new Chart.Line(ctx, {
        data:data,
        options:option
    });

}
