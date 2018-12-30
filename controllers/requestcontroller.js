
var express = require('express');
const passport=require('passport');
var Request=require('../models/request-model');
var User=require('../models/user-model');
var fs = require('fs');
var path = require('path');
const https = require('https');

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

var requestPage= (req, res)=> {

Request.find({ shiperOrshippingTo:{ $size: 1 },
conignee: { $size: 1 } , 'downloadex':false 
 }).distinct('shiperOrshippingTo.country1').then(function(results){
   let countries=results;
 //console.log(results);

  Request.find().then(function(result){

  let reqs=result.filter((result)=>{
   
     return !result.downloadex;
    
     
   });
   
   res.render('requestpage',{user:req.user,countries:countries,requests:reqs});
  });

});

  };



  var DownloadExcell=(req,res,next)=>{
var datai=" InBound Requests "+'\n';
datai=datai+"  "+'\t'+"  "+'\t'+" Shipping From "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\t'+
               "  "+'\t'+"  "+'\t'+"  "+'\t'
           +"  "+'\t'+"  "+'\t'+" Cosignee "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\n';

datai=datai+" Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\t'+
            "  "+'\t'+"  "+'\t'+" "+'\t'+
        " Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\n';


var datao="   OutBound Requests   "+'\n';
datao=datao+"  "+'\t'+"  "+'\t'+" Shipper "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\t'+
            "  "+'\t'+"  "+'\t'+"  "+'\t'
            +"  "+'\t'+"  "+'\t'+" Cosignee "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\n';
        
datao=datao+" Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\t'+
        "  "+'\t'+"  "+'\t'+" "+'\t'+
        " Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\n';
     
      var ConnName=req.body.ConnName;
      //console.log("Printing Download Coun "+req.body.ConnName);
  
      var d = new Date();
      var t=d.getDate();
      var m=d.getMonth()+1;
      var y=d.getFullYear();
      var da=t+"/"+m+"/"+y;


      //////////////////////////////////////////////////////////////////////////////
      
      Request.find({'downloadex':false,'shiperOrshippingTo.country1':ConnName}).then(function(results){

        for(k=0;k<results.length;k++){

      
          if(results[k].reqtype=='INBOUND'){
      
            datai=datai+results[k].shiperOrshippingTo[0].cpname1+'\t'+results[k].shiperOrshippingTo[0].cpnum1+'\t'+results[k].shiperOrshippingTo[0].comname1+'\t'+results[k].shiperOrshippingTo[0].comadd1+'\t'+results[k].shiperOrshippingTo[0].city1+'\t'+results[k].shiperOrshippingTo[0].country1+'\t'+
              "  "+'\t'+"  "+'\t'+" "+'\t'+
              results[k].conignee[0].cpname2+'\t'+results[k].conignee[0].cpnum2+'\t'+results[k].conignee[0].comname2+'\t'+results[k].conignee[0].comadd2+'\t'+results[k].conignee[0].city2+'\t'+results[k].conignee[0].country2+'\n';
          }
  
          if(results[k].reqtype=='OUTBOUND'){
      
            datao=datao+results[k].shiperOrshippingTo[0].cpname1+'\t'+results[k].shiperOrshippingTo[0].cpnum1+'\t'+results[k].shiperOrshippingTo[0].comname1+'\t'+results[k].shiperOrshippingTo[0].comadd1+'\t'+results[k].shiperOrshippingTo[0].city1+'\t'+results[k].shiperOrshippingTo[0].country1+'\t'+
              "  "+'\t'+"  "+'\t'+" "+'\t'+
              results[k].conignee[0].cpname2+'\t'+results[k].conignee[0].cpnum2+'\t'+results[k].conignee[0].comname2+'\t'+results[k].conignee[0].comadd2+'\t'+results[k].conignee[0].city2+'\t'+results[k].conignee[0].country2+'\n';
          }
  
  
      }


//updating Documents

      for(l=0;l<results.length;l++){

        Request.updateOne({_id:results[l]._id},{downloadex:true,downloaddate:da}).then(function(resultss){
        
      
         console.log("Updating "+l+resultss);
       });
        
      }


    ////preparing the excell sheet
    var data=datai+datao;
 
  var filename=ConnName+'.xls';
fs.writeFile(filename, data, (err) => {
    if (err) throw err;
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
  } else {console.log(error);}
});
      }
      else{}
    });
     
  //////////EOF downloading the excell file
         
       }
 });
////////////////////////////////
       });

     };











     var DownloadExcell2=(req,res,next)=>{


      var datai=" InBound Requests "+'\n';
      datai=datai+"  "+'\t'+"  "+'\t'+" Shipping From "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\t'+
                     "  "+'\t'+"  "+'\t'+"  "+'\t'
                 +"  "+'\t'+"  "+'\t'+" Cosignee "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\n';
      
      datai=datai+" Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\t'+
                  "  "+'\t'+"  "+'\t'+" "+'\t'+
              " Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\n';
      
      
      var datao="   OutBound Requests   "+'\n';
      datao=datao+"  "+'\t'+"  "+'\t'+" Shipper "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\t'+
                  "  "+'\t'+"  "+'\t'+"  "+'\t'
                  +"  "+'\t'+"  "+'\t'+" Cosignee "+'\t'+"  "+'\t'+"  "+'\t'+"  "+'\n';
              
      datao=datao+" Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\t'+
              "  "+'\t'+"  "+'\t'+" "+'\t'+
              " Contact Person "+'\t'+" Contact Person Number "+'\t'+" Company Name "+'\t'+" Company Address "+'\t'+" City "+'\t'+" Country "+'\n';
           
            var ConnName=req.body.CounName;
            var dowdate=req.body.downdate;

           
      
      
          /////////////////////////////////////////////////////////////////////////////////////////////
      
          
            Request.find({'downloadex':true,'shiperOrshippingTo.country1':ConnName,'downloaddate':dowdate,'requestqueue':false}).then(function(results){
      
      
      
              for(k=0;k<results.length;k++){
      
            
                if(results[k].reqtype=='INBOUND'){
            
                  datai=datai+results[k].shiperOrshippingTo[0].cpname1+'\t'+results[k].shiperOrshippingTo[0].cpnum1+'\t'+results[k].shiperOrshippingTo[0].comname1+'\t'+results[k].shiperOrshippingTo[0].comadd1+'\t'+results[k].shiperOrshippingTo[0].city1+'\t'+results[k].shiperOrshippingTo[0].country1+'\t'+
                    "  "+'\t'+"  "+'\t'+" "+'\t'+
                    results[k].conignee[0].cpname2+'\t'+results[k].conignee[0].cpnum2+'\t'+results[k].conignee[0].comname2+'\t'+results[k].conignee[0].comadd2+'\t'+results[k].conignee[0].city2+'\t'+results[k].conignee[0].country2+'\n';
                }
        
                if(results[k].reqtype=='OUTBOUND'){
            
                  datao=datao+results[k].shiperOrshippingTo[0].cpname1+'\t'+results[k].shiperOrshippingTo[0].cpnum1+'\t'+results[k].shiperOrshippingTo[0].comname1+'\t'+results[k].shiperOrshippingTo[0].comadd1+'\t'+results[k].shiperOrshippingTo[0].city1+'\t'+results[k].shiperOrshippingTo[0].country1+'\t'+
                    "  "+'\t'+"  "+'\t'+" "+'\t'+
                    results[k].conignee[0].cpname2+'\t'+results[k].conignee[0].cpnum2+'\t'+results[k].conignee[0].comname2+'\t'+results[k].conignee[0].comadd2+'\t'+results[k].conignee[0].city2+'\t'+results[k].conignee[0].country2+'\n';
                }
        
        
            }
      
      
      //updating Documents
      
            
      
      
          ////preparing the excell sheet
          var data=datai+datao;
      //    console.log("Printing Excell Infos"+data);
      
      
      
        var filename=ConnName+'.xls';
      fs.writeFile(filename, data, (err) => {
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
            else{
      
            }
          });
           
      
               
             }
       });
      
             });
      
      
  };


var SetCourrierName=(req,res)=>{

  Request.aggregate([
    {"$match":{"downloadex":true,"requestqueue":false}}, //filtering staeps 
    { "$group": { _id :{"downloaddate":"$downloaddate","country":"$shiperOrshippingTo.country1"},
                  totalreqs: { $sum: 1 }
                 } },
  
    ]).then((result)=>{
    let couns=result;

              Request.find({ shiperOrshippingTo:{ $size: 1 },
                conignee: { $size: 1 } , 'downloadex':true,'requestqueue':false
                }).then((results)=>{
                  var reqs=results;
                
              res.render('setCourrierCom',{user:req.user,couns:couns,requests:reqs});
                  });
          
  }).catch((err)=>{
    console.log(err);
  });


};


var InsertCourrierName=(req,res)=>{


  var ccname=req.body.CComName;
  var counName=req.body.CounNamee;
  var downdate=req.body.downdatee;
  Request.find({'downloadex':true,'shiperOrshippingTo.country1':counName,'downloaddate':downdate,'requestqueue':false}).then((results)=>{

          for(l=0;l<results.length;l++){
            Request.updateOne({_id:results[l]._id},{requestqueue:true,courriercomname:ccname}).then(function(resultss){
            console.log("Updating "+l+resultss);
           }); 
          }

          res.redirect('/requests/SetCourrierName');
         });

};
module.exports={
    authCheck,
    requestPage,
    SetCourrierName,
    DownloadExcell,
    DownloadExcell2,
    InsertCourrierName

}