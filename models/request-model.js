const mongoose=require('mongoose');
const Schema=mongoose.Schema;
var myDate = new Date();
//var myDateInitUsingISODateWrapper = ISODate();


let conigneeSchema=new Schema({
    cpname2:{type: String,required:false},
    cpnum2:{type: String,required:false},
    comname2:{ type:String,required:false},
    comadd2:{ type:String,required:false},
    city2:{ type:String,required:false},
    country2:{ type:String,required:false},  
});



let shiperOrshippingToSchema=new Schema({
    cpname1:{type: String,required:false},
    cpnum1:{type: String,required:false},
    comname1:{ type:String,required:false},
    comadd1:{ type:String,required:false},
    city1:{ type:String,required:false},
    country1:{ type:String,required:false},
   
});

let reqDetailSchema=new Schema({
    buyer:{type: String,required:false},
    orderNumber:{type: String,required:false},
    style:{type: String,required:false},
    article:{type: String,required:false},
    item:{type: String,required:false},
    estemWeight:{type: String,required:false},
});

let userDetailSchema=new Schema({
   //user info
   userId:{ type: String ,required:true},
   usermail:{type:String,required:true},
   username:{type:String,required:true},
   //request date
   reqmonth:{type:String,required:false},
   reqyear:{type:String,required:false},

});

let boxDetailSchema=new Schema({
    weight:{type: String,required:false},
    boxSize:{type: String,required:false},
   // estemWeight:{type: String,required:false},
});

let requestSchema=new Schema({
    
 
  
    //request detail
    reqtype:{ type: String ,required:true},
      //company name 
    comname:{type: String,required:false},
    shiperOrshippingTo:[shiperOrshippingToSchema],
    conignee:[conigneeSchema],
    reqDetail:[reqDetailSchema],
    userDetail:[userDetailSchema],
    
    //////////inner boundaries for request queue
    
    downloadex:{ type: Boolean ,default:false}, //set after adding request# indicates unseen request
    downloaddate:{type:String,default:""},
    courriercomname:{type: String,default:""},
    requestqueue:{ type: Boolean ,default:false}, //set to true after adding courrier com name



    //////inner boundaries for process queue 

    /////final done
    finaldone:{ type: Boolean ,default:false},
    ///////final done
    //#### will be received from requestqueue==true and received==false
    //processqueue:{ type: Boolean ,default:false},
    received:{ type: Boolean ,default:false},
    cost:{ type: Number, required:false},
    receiveddate:{type:String,required:false},
    receivedmonth:{type:String,required:false},
    receivedyear:{type:String,required:false},
    boxDetail:[boxDetailSchema],

});





const Requests=mongoose.model('request',requestSchema);

module.exports=Requests;