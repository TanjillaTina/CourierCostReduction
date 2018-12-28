
var express = require('express');
const passport=require('passport');
var Request=require('../models/request-model');
var Down=require('../models/down-dates');
//auth login

var authCheck=(req,res,next)=>{
    if(!req.user){
      //if user isn't logged in 
      req.flash('error_msg', 'You are not authorized to view that page');
      res.redirect('/');
 
    }
    else{
      //if logged in
     next();
    }
 };

var confirmPage= (req, res)=> {

  Request.find({ shiperOrshippingTo:{ $size: 1 },
    conignee: { $size: 1 } , 'downloadex':false 
     }).distinct('shiperOrshippingTo.country1').then(function(results){
       let countries=results;
     //console.log(results);
    
      Request.find({requestqueue:true}).then(function(result){
    
      let reqs=result.filter((result)=>{
       
         return !result.finaldone;
        
         
       });
      // console.log("Printing Not Finals"+ reqs);
       
       res.render('confirmpage',{user:req.user,couns:countries,requests:reqs});
      });
    
    });
    

    //res.render('confirmpage',{user:req.user});
  };

  var SetForInbound=(req,res)=>{
  

    var d = new Date();
    var t=d.getDate();
    var m=d.getMonth()+1;
    var y=d.getFullYear();
    

    var costi=req.body.costi;
    var idi=req.body.idi;
    

    Request.updateOne({_id:req.body.idi},{
      finaldone:true,
      received:true,
      cost:req.body.costi,
      receiveddate:d.getDate(),
      receivedmonth:d.getMonth()+1,
      receivedyear:d.getFullYear()
    }).then(function(resultss){
        
      
      console.log("Updating "+resultss);


      res.redirect('/confirms');
    });




  };

  var SetForOutbound=(req,res)=>{

  
    var d = new Date();
    var t=d.getDate();
    var m=d.getMonth()+1;
    var y=d.getFullYear();


    var weight=req.body.weight;
    var boxsize=req.body.boxsize;
    var costo=req.body.costo;
    var ido=req.body.ido;

var boxsdetail={
  weight:req.body.weight,
   boxSize:req.body.boxsize
};
    
    Request.updateOne({_id:req.body.ido},{
      finaldone:true,
      received:true,
      cost:costo,
      receiveddate:d.getDate(),
      receivedmonth:d.getMonth()+1,
      receivedyear:d.getFullYear(),
      boxDetail:boxsdetail
      
    }).then(function(results){
 
      res.redirect('/confirms');
    });

  

  };

module.exports={
    authCheck,
    confirmPage,
    SetForInbound,
    SetForOutbound
}