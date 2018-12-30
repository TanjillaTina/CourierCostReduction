var express = require('express');

var Request=require('../models/request-model');

var indexPage= (req, res)=> {

  Request.find({ shiperOrshippingTo:{ $size: 1 },
    conignee: { $size: 1 } , 'finaldone':true 
     }).distinct('receivedyear').then((result)=>{
       
      res.render('index', { user: req.user,mesg:req.flash()});      
     }).catch((err)=>{
      console.log(err);
    });


  };

  var viewChart=(req,res)=>{

  
    var yearr=req.body.selectyear;
    if(!yearr){
      req.flash('error_msg', 'You must select a year to view that page');
      res.redirect('/');
    }
    else{
  
      Request.find({'finaldone':true}).distinct('comname')
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



///////////////////////////////////////////////////////////////////////
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
  
      Request.find().distinct('userDetail.usermail')
       .then((results)=>{


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
/////////////////////////////

  for(var k=0;k<reqs.length;k++){
    console.log("User Mail "+reqs[k]._id.usermail+" User Name "+reqs[k]._id.username+"Total Requests "+reqs[k].totalAmount+" Request Year "+reqs[k]._id.reqyear+" Request Month "+reqs[k]._id.reqmonth);
  }

  var namesara="";
/////////////////////////////
for(var com=0;com<results.length;com++){
  for(var k=0;k<reqs.length;k++){
    if(finalArray[com][0]==reqs[k]._id.usermail){
      var mo=reqs[k]._id.reqmonth;
      finalArray[com][parseInt(mo)]=reqs[k].totalAmount;
      //namesara+=((reqs[k]._id.username)+'|');
    }
  }
}
/////////////
// for(var com=0;com<results.length;com++){
//   for(var k=0;k<reqs.length;k++){
//     if(finalArray[0][com]==reqs[k]._id.usermail){
//       namesara+=((reqs[k]._id.username)+'|');
//     }
//   }
// }
console.log("pRINTING fINAL aRRAY "+JSON.stringify(finalArray));
console.log("pRITING nAMES "+namesara);
  res.render('indexchart2',{year:yearr,datai:finalArray,names:namesara});
            
}).catch((err)=>{
  console.log(err);
});


       })
         .catch((err)=>{
          console.log(err);
        });

}
  };
module.exports = {
    indexPage,
    viewChart,
    viewChart2
    };

 