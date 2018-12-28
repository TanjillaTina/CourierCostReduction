var express = require('express');

var Request=require('../models/request-model');

var month =["01","02","03","04","05","06","07","08","09","10","11","12"];
var GetUsers=function(users){

};
var MonthLength=function(user,yearr){
    var arra=new Array();
    arra.push(user);
console.log("User name is "+user);
    for(var i=0;i<month.length;i++){
    console.log("id "+i+" month is "+month[i]);
     Request.find({'userDetail.username':user,'receivedmonth':month[i],'receivedyear':yearr}).then(function(result){
    
      let reqs=result.filter((result)=>{
     
         return result;
        
         
       });
     console.log("Length is "+reqs.length);
    arra.push(result.length);
      // res.render('requestpage',{user:req.user,countries:countries,result:reqs});
       
      });
    
    }
    return arra;
};


module.exports={
    MonthLength,
    GetUsers
}