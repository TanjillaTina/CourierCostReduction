var express = require('express');
var UserModel=require('../models/user-model');
var Request=require('../models/request-model');
var Country=require('../models/countries');
var InCountry=require('../models/inserted-countries');
//this fun is to check if,someone is logged-in in the page, if yes, redirect to profile page, else redirect to login page
//middleware function, that's gonna set in before profile page is redirected
var authCheck=(req,res,next)=>{
    if(!req.user){
      //if user isn't logged in 
      req.flash('error_msg', 'You must login via office mail to view that page');
      res.redirect('/');
 
    }
    else{
      //if logged in
     next();
    }
 };

 var profilePage= (req, res)=> {
  var user=req.user;
//////////////////////////////////////
Country.find({},null,{sort: {countryname: 1}}).then(function(results){
  
  let countriesa=results.filter((results)=>{
    return results;   
}

);
res.render('profile',{user:user,//reqstat:RequestStatus,//
  countriess:countriesa,mesg:req.flash()});

});

};





      var addRequest=(req,res)=>{

        var user=req.user;
        var d = new Date();
        var t=d.getDate();
        var m=d.getMonth()+1;
        var y=d.getFullYear();
        //var da=t+"/"+m+"/"+y;
        

            let request=new Request({
              reqtype:req.body.reqType,
              comname:user.comname,
             // username:user.username,
               
            });

            request.save().then((result)=>{
                console.log("Saved Result -> "+result);

              result.shiperOrshippingTo.push({
                cpname1:req.body.comname1,
                cpnum1:req.body.cpnum1,
                comname1:req.body.comname1,
                comadd1:req.body.comadd1,
                city1:req.body.city1,
                country1:req.body.country1
                
              });
              result.conignee.push({
                cpname2:req.body.comname2,
                cpnum2:req.body.cpnum2,
                comname2:req.body.comname2,
                comadd2:req.body.comadd2,
                city2:req.body.city2,
                country2:req.body.country2
                
              });
              result.reqDetail.push({
                buyer:req.body.buyer,
                orderNumber:req.body.orderNumber,
                style:req.body.style,
                article:req.body.article,
                item:req.body.item,
                estemWeight:req.body.estemWeight
              });
              result.userDetail.push({
                userId:user._id,
                usermail:user.email,
                //request date
                username:user.username,
                reqmonth:m,
                reqyear:y
              });


              result.save().then(function(){
                req.flash('insert_msg', 'Your Form Is Submitted Successfully!!');
                console.log("Saved Successfully....");
                res.redirect('/profile');
              }).catch((err)=>{
                console.log(err);
                req.flash('cant_insert_msg', 'Sorry!! Failed to submit form!! Try Again!!');
                res.redirect('/profile');  
              });
              
            }).catch((err)=>{
              console.log(err);
              req.flash('cant_insert_msg', 'Sorry!! Failed to submit form!! Try Again!!');
              res.redirect('/profile');  
            });
    
        };


 module.exports = {
  authCheck,
  profilePage,
  addRequest
 
  };

