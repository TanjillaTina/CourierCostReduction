const CHART=document.getElementById("lineChart");
//console.log(CHART);


let lineChart = new Chart(CHART, {
    type: 'line',
    data:  {
        labels: ["January", "February", "March", "April", "May", "June", "July","August","September","October","November","December"],
        datasets: [
            {
                label: "Budget Cost",
                lineTension:.05,
                fill: false,
                backgroundColor:"rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle:'butt',
                borderDash:[],
                borderDashOffset:0.0,
                borderJoinStyle:'miter',
                pointBorderColor:"rgba(75,192,192,1)",
                pointBackgroundColor:"#fff",
                pointBorderWidth:1,
                pointHoverRadius:5,
                pointHoverBackgroundColor:"rgba(75,192,192,1)",
                pointHoverBorderColor:"rgba(220,220,220,1)",
                pointHoverBorderWidth:2,
                pointRadius:1,
                pointHitRadius:10,
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [6500, 5998, 7880, 8681, 5676, 9055, 4560,2548, 4658, 4350, 1869, 3486]
            },
            
            {   
                label: "Original Cost",
                lineTension:.05,
                fill: false,
                backgroundColor:"rgba(183, 18, 53,0.4)",
                borderColor: "rgba(183, 18, 53,1)",
                borderCapStyle:'butt',
                borderDash:[],
                borderDashOffset:0.0,
                borderJoinStyle:'miter',
                pointBorderColor:"rgba(183, 18, 53,1)",
                pointBackgroundColor:"#fff",
                pointBorderWidth:1,
                pointHoverRadius:5,
                pointHoverBackgroundColor:"rgba(183, 18, 53,1)",
                pointHoverBorderColor:"rgba(220,220,220,1)",
                pointHoverBorderWidth:2,
                pointRadius:1,
                pointHitRadius:10,
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [1020, 2044, 3025, 4219, 3953, 5346, 8428,4420, 1569, 8236, 2712, 9043]
            }
        ]
    },
    
});