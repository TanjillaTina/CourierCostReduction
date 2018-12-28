const mongoose=require('mongoose');
const Schema=mongoose.Schema;


let countriesSchema=new Schema({
    countryname:{type:String,required:false},

});

let downdateSchema=new Schema({
    status:{type:Boolean,default:false},
    downdate:{type:String,required:true},
    couns:[countriesSchema] 

});

const Downdates=mongoose.model('downdate',downdateSchema);

module.exports=Downdates;