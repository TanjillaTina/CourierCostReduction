var path = require('path');


function parseData(createGraph) {
/*	Papa.parse("../data/mydata.csv", {
        //download: true,
        header: true,
        download: true,
        dynamicTyping: true,
		complete: function(results) {
            console.log(results.data);
			createGraph(results.data);
		}
    });
    */
   var fileLocation = path.join('./','mydata.csv');
   console.log(fileLocation);

   d3.csv(fileLocation,function(rows){
        console.log(rows);
        createGraph(rows);

   });
}

function createGraph(data){

    var chart = c3.generate({
        bindto: '#chart',
        axis: {
    x: {
        type: 'category',
        categories: ['Jan', 'Feb','Mar', 'Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    
    }
},
        data: {
          columns:data
        }
    });
}


parseData(createGraph);