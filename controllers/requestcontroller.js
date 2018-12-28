
var express = require('express');
const passport=require('passport');
var Request=require('../models/request-model');
var Down=require('../models/down-dates');
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


  var SendToOnProcess=(req,res)=>{
 var requesstId=req.body.reqqId;
 console.log("Printing Req Id "+requesstId);


 //res.redirect('/requests');

 Request.findById(requesstId, function(err, usera) {
    usera.set(usera.requestQueue=!usera.requestQueue);
  

  // Using a promise rather than a callback
  usera.save().then(function(savedPost) {
    res.redirect('/requests');
  }).catch(function(err) {
    res.status(500).send(err);
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
      //console.log("Printing Country Name from excell "+ConnName);
      ///////////getting download Date

  
 
      var d = new Date();
      var t=d.getDate();
      var m=d.getMonth()+1;
      var y=d.getFullYear();
      var da=t+"/"+m+"/"+y;


      //////////////////////////////////////////////////////////////////////////////
      
               //check if user already exists in our db
               Down.findOne({'downdate': da}).then((currentDown)=>{
                if(currentDown){
                  currentDown.couns.push({
                    countryname:ConnName
                  });
                  currentDown.save().then(()=>{
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////          
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
  //  console.log("Printing Excell Infos"+data);



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
                  }); 
                }
                else{
                    //if nt, create new user in db
                    console.log("Failed to Find Dwnload Collection");
                    let newdown=new Down({
                      downdate:da 
                    });
                
                    newdown.save().then((resultd)=>{
                      //  console.log("New Download Data is Saved "+ resultd);
                
                      resultd.couns.push({
                        countryname:ConnName
                      });
                      resultd.save().then(()=>{
                          
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
  //  console.log("Printing Excell Infos"+data);



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
  } else { console.log(error);}
});
      }
      else{ }
    });
     

         
       }
 });

       });
                      });
                      
                    }).catch((err)=>{
                     // throw err;
                     console.log("Download date is saved but, failed to save country name"+err);
                    });
                      

                  }
                });
    /////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////////////////////////////

  


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


  Request.find({ shiperOrshippingTo:{ $size: 1 },
    conignee: { $size: 1 } , 'downloadex':true,'requestqueue':false
     }).then(function(results){
      var requests=results;
     //console.log(results);
    

     Down.find({'status':false}).then(function(resultsd){
        downsdate=resultsd;

          //res.render('setCourrierCom');
  res.render('setCourrierCom',{user:req.user,downsdate:downsdate,requests:requests});
      });


    });


};


var InsertCourrierName=(req,res)=>{


  var ccname=req.body.CComName;
  var counName=req.body.CounNamee;
  var downdate=req.body.downdatee;
  //console.log("Com Nmae "+ccname+"  Con "+counName+" dddd "+downdate);

       //////////////////////////////////////////////////////////////////////////////
      
               //check if user already exists in our db
               Down.findOne({'downdate': downdate}).then((currentDown)=>{
                if(currentDown){
                  currentDown.couns.pop({
                    countryname:counName
                  });
                  currentDown.save().then(()=>{  ///if countryname is popped
                    Request.find({'downloadex':true,'shiperOrshippingTo.country1':counName,'downloaddate':downdate,'requestqueue':false}).then(function(results){

                      //updating Documents
                      
                            for(l=0;l<results.length;l++){
                              Request.updateOne({_id:results[l]._id},{requestqueue:true,courriercomname:ccname}).then(function(resultss){
                              console.log("Updating "+l+resultss);
                             }); 
                            }
                           });

                           res.redirect('/requests/SetCourrierName');
                  }); 
                }
                else{
                    //if nt, create new user in db
                    console.log("Failed to Find Dwnload Collection");
     
                  }
                });
    /////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////////////////////////////

    
      



};
module.exports={
    authCheck,
    requestPage,
    SendToOnProcess,
    SetCourrierName,
    DownloadExcell,
    DownloadExcell2,
    InsertCourrierName

}