var express = require('express');
var fs = require('fs');
var path = require('path');
const https = require('https');
var Request=require('../models/request-model');
var reqyear="";
var receivedyear="";
var MoFun=require('../extraFunctions/getmonth');
var indexPage= (req, res)=> {

  Request.find({ shiperOrshippingTo:{ $size: 1 },
    conignee: { $size: 1 } , 'finaldone':true 
     }).distinct('receivedyear').then((result)=>{
       
        receivedyear=result;
       
      Request.find({ shiperOrshippingTo:{ $size: 1 },
        conignee: { $size: 1 } 
         }).distinct('userDetail.reqyear').then((results)=>{
           
            reqyear=results;
         
          res.render('index', { user: req.user,mesg:req.flash(),reqyear:reqyear,receivedyear:receivedyear});      


         }).catch((err)=>{
          throw err;
        });
  
     }).catch((err)=>{
      throw err;
    });


  };

  var viewChart=(req,res)=>{

  
    var yearr=req.body.selectyear;
    if(!yearr){
      req.flash('error_msg', 'You must select a year to view that page');
      res.redirect('/');
    }
    else{
  
      Request.find({'finaldone':true, 'receivedyear' : yearr }).distinct('comname')
       .then((results)=>{

/////////*********************** */
var finalArray=new Array();

var b=0;
for(b=0;b<results.length;b++){
  var o=b;
  if((o+1)==results.length){
    var inarray=new Array(14).fill(0);
    inarray[0]=results[b];
    finalArray.push(inarray);
  }
  else{
    var inarray=new Array(13).fill(0);
    inarray[0]=results[b];
    finalArray.push(inarray);
  }
 
  inarray=[];

}


var ara=new Array();
Request.aggregate([
  {"$match":{"receivedyear":yearr,"finaldone":true}}, //filtering staeps 
  { "$group": { _id :{"comname":"$comname","receivedmonth":"$receivedmonth"},
                totalAmount: { $sum:"$cost"}
               } },

  ]).then((result)=>{
  let reqs=result;

for(var com=0;com<results.length;com++){
  for(var k=0;k<reqs.length;k++){
    if(finalArray[com][0]==reqs[k]._id.comname){
      var mo=reqs[k]._id.receivedmonth;
      finalArray[com][parseInt(mo)]=reqs[k].totalAmount;
    }
  }
}
  res.render('indexchart',{year:yearr,datai:finalArray});
            
}).catch((err)=>{
  console.log(err);
});

       })
         .catch((err)=>{
          console.log(err);
        });

 }
  };

  
  var viewChart2=(req,res)=>{

    var yearr=req.body.selectyear2;
    if(!yearr){
      req.flash('error_msg', 'You must select a year to view that page');
      res.redirect('/');
    }
    else{
  
      Request.find({ 'userDetail.reqyear' : yearr }).distinct('userDetail.usermail')
       .then((results)=>{
console.log("Prinitg Maiks "+results);

var finalArray=new Array();

var b=0;
for(b=0;b<results.length;b++){
  var o=b;
  if((o+1)==results.length){
    var inarray=new Array(14).fill(0);
    inarray[0]=results[b];
    finalArray.push(inarray);
  }
  else{
    var inarray=new Array(13).fill(0);
    inarray[0]=results[b];
    finalArray.push(inarray);
  }
 
  inarray=[];

}



///////////////////////////////////////////////////////////////////////
var ara=new Array();
Request.aggregate([
  {"$match":{"userDetail.reqyear":yearr}}, //filtering staeps 
  { "$group": { _id :{"reqyear":"$userDetail.reqyear","reqmonth":"$userDetail.reqmonth","usermail":"$userDetail.usermail","username":"$userDetail.username"},
                totalAmount: { $sum: 1 }
               } },

  ]).then((result)=>{
  let reqs=result;
  var namesara="";
/////////////////////////////
for(var com=0;com<results.length;com++){
  for(var k=0;k<reqs.length;k++){
    if(finalArray[com][0]==reqs[k]._id.usermail){
      var mo=reqs[k]._id.reqmonth;
      finalArray[com][parseInt(mo)]=reqs[k].totalAmount;
    }
  }
}

///////////////////////////////////
Request.find({ shiperOrshippingTo:{ $size: 1 },
  conignee: { $size: 1 } 
   }).distinct('userDetail.reqyear').then((results)=>{
     
      reqyear=results;
   
////////////////////////////////
          Request.find({ shiperOrshippingTo:{ $size: 1 },
            conignee: { $size: 1 } 
            }).distinct('userDetail.reqmonth').then((resultsz)=>{
              
                reqmonth=resultsz;
               console.log("Printing Request Month "+reqmonth);
          res.render('indexchart2',{year:yearr,datai:finalArray,names:namesara,reqyear:reqyear,reqmonth:reqmonth});    
              

            }).catch((err)=>{
              throw err;
            });
/////////////////////////////

   }).catch((err)=>{
    throw err;
  });
            
}).catch((err)=>{
  console.log(err);
});


       })
         .catch((err)=>{
          console.log(err);
        });

}
  };

  var downExcMonth=(req,res)=>{
    var d = new Date();
    var monthd=d.getMonth()+1;
    var yearr=d.getFullYear();
    var ara=new Array();

Request.aggregate([
  {"$match":{"userDetail.reqyear":yearr.toString(),"userDetail.reqmonth":monthd.toString()}}, //filtering staeps 
  { "$group": { _id :{"username":"$userDetail.username","usermail":"$userDetail.usermail"},
                totalreqs: { $sum: 1 }
               } },

  ]).then((results)=>{
  let reqs=results;

  var datai='\t'+" Total Request Details of Month  "+monthd+"of Year "+yearr+'\t'+'\n';
      
  datai=datai+"   Person Name   "+'\t'+"   Mail ID   "+'\t'+"   Total Number of Requests   "+'\n';
 
  for(k=0;k<results.length;k++){
      
      datai=datai+results[k]._id.username+'\t'+results[k]._id.usermail+'\t'+results[k].totalreqs+'\n';
      console.log(datai);
    
}
var finame="RequestSheet of month "+monthd+" of year "+yearr;
//var finame="RequestSheet of month ";
var filename=finame+'.xls';
fs.writeFile(filename, datai, (err) => {
    if (err) throw err;
    //console.log('File created');
        ////preparing the excell sheet
       else{
         
  //////////downloading the excell file
  
    var fileLocation = path.join('./',filename);
    console.log(fileLocation);
    res.download(fileLocation, filename,err=>{
      if(!err){
        
        fs.access(fileLocation, error => {
  if (!error) {
      fs.unlink(fileLocation,function(error){
          console.log(error);
      });
  } else {
      console.log(error);
  }
});
      }
      else{}
    });
     

         
       }
 });

           
}).catch((err)=>{
  throw err;
});

  };







  var flatrate=(req,res)=>{


    var boxes=new Array();

    Request.find({ boxDetail:{ $size: 1 } })
    .distinct('boxDetail.boxSize').then(function(results){
         let boxsizes=results;
      });


      /////////////////////////////////
Request.aggregate([
  {"$match":{"boxDetail":{ $size: 1 }}},
  { "$group": { _id :{"boxsize":"$boxDetail.boxSize","month":"$receivedmonth","year":"$receivedyear"},
                totalcount: { $sum: 1 }
               } },

  ]).then((results)=>{
  let reqs=results;
  console.log("Printing distinct total box size number for month and year");
  for(var i=0;i<reqs.length;i++){
    console.log("Boxsize "+reqs[i]._id.boxsize+" Month "+reqs[i]._id.month+" Year "+reqs[i]._id.year+" Total No "+reqs[i].totalcount);
  }


          Request.aggregate([
            {"$match":{"boxDetail":{ $size: 1 }}},
            { "$group": { _id :{"month":"$receivedmonth","year":"$receivedyear"},
                          totalbox: { $sum: 1 }
                        } },
          
            ]).then((resultss)=>{
            let reqss=resultss;
            
            reqss.sort(function (a, b) {
              return a._id.month - b._id.month;
         });

            console.log("Printing distinct totalnumber of boxes for month and year");
            for(var i=0;i<reqss.length;i++){
             // console.log(" Month "+reqss[i]._id.month+" Year "+reqss[i]._id.year+" Total No "+reqss[i].totalbox);
            }

            for(var i=0;i<reqs.length;i++){
              for(var j=0;j<reqss.length;j++){
                if(reqs[i]._id.month==reqss[j]._id.month && reqs[i]._id.year==reqss[j]._id.year){

                   var persa=((100*parseInt(reqs[i].totalcount))/parseInt(reqss[j].totalbox));
                   var box={percen:Math.floor(persa),
                           month:reqs[i]._id.month,
                           year:reqs[i]._id.year,
                           boxsize:reqs[i]._id.boxsize,
                           //monthname:MoFun.getMonth(month)
                          }
                        boxes.push(box);
                }
              }
            }
          
            // sort by value
            boxes.sort(function (a, b) {
                 return a.percen - b.percen;
            });
            for(var y=0;y<boxes.length;y++){
               console.log("Month "+boxes[y].month+" Year "+boxes[y].year+" Boxsize "+boxes[y].boxsize+" Percentage "+boxes[y].percen);
            }


          
            /////////////////////////////////////////////////////////////////////

            Request.find({ boxDetail:{ $size: 1 }}
              ).distinct('receivedyear').then(function(resultz){
                 let dates=resultz;
                 dates.sort(function (a, b) {
                  return b-a;
                });
                res.render('flatrate',{dates:dates,boxes:boxes,may:reqss});
              });
            
          }).catch((err)=>{
            throw err;
          });

           
}).catch((err)=>{
  throw err;
});

  };

var dwnExMY=(req,res)=>{
 
  var years=req.body.ryear;
  var months=req.body.rmonth;
  console.log("Month "+months+" Year "+years);
  var ara=new Array();

Request.aggregate([
{"$match":{"userDetail.reqyear":years,"userDetail.reqmonth":months}}, //filtering staeps 
{ "$group": { _id :{"username":"$userDetail.username","usermail":"$userDetail.usermail"},
              totalreqs: { $sum: 1 }
             } },

]).then((results)=>{
let reqs=results;

var datai='\t'+" Total Request Details of Month  "+months+"of Year "+years+'\t'+'\n';
    
datai=datai+"   Person Name   "+'\t'+"   Mail ID   "+'\t'+"   Total Number of Requests   "+'\n';

for(k=0;k<results.length;k++){
    
    datai=datai+results[k]._id.username+'\t'+results[k]._id.usermail+'\t'+results[k].totalreqs+'\n';
    console.log(datai);
  
}
var finame="RequestSheet of month "+months+" of year "+years;
//var finame="RequestSheet of month ";
var filename=finame+'.xls';
fs.writeFile(filename, datai, (err) => {
  if (err) throw err;
  //console.log('File created');
      ////preparing the excell sheet
     else{
       
//////////downloading the excell file

  var fileLocation = path.join('./',filename);
  console.log(fileLocation);
  res.download(fileLocation, filename,err=>{
    if(!err){
      
      fs.access(fileLocation, error => {
if (!error) {
    fs.unlink(fileLocation,function(error){
        console.log(error);
    });
} else {
    console.log(error);
}
});
    }
    else{}
  });
   

       
     }
});

         
}).catch((err)=>{
throw err;
});

};
module.exports = {
    indexPage,
    viewChart,
    viewChart2,
    downExcMonth,
    flatrate,
    dwnExMY
    };

 