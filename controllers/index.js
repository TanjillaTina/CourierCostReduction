var express = require('express');
// var readline = require('readline');
// var fs = require('fs');
//const Country=require('../models/countries');


var indexPage= (req, res)=> {



    res.render('index', { user: req.user,mesg:req.flash()});
  };

  var viewChart=(req,res)=>{

    var year=req.body.selectyear;
    if(!year){
      req.flash('error_msg', 'You must select a year to view that page');
      res.redirect('/');
    }
    else{
 
      res.render('indexchart',{year:year});
      
    }
   
  };
module.exports = {
    indexPage,
    viewChart
    };
  
  