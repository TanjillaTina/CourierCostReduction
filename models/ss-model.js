const mongoose=require('mongoose');
const Schema=mongoose.Schema;



let shipSchema=new Schema({
    cpname1:{type: String,required:false},
    cpnum1:{type: String,required:false},
    comname1:{ type:String,required:false},
    comadd1:{ type:String,required:false},
    city1:{ type:String,required:false},
    country1:{ type:String,required:false},  
});




const SSto=mongoose.model('ship',shipSchema);

module.exports=SSto;