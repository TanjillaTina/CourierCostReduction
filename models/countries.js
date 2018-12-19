const mongoose=require('mongoose');
const Schema=mongoose.Schema;



let countrySchema=new Schema({
    countryname: {type: String,required:true}

});

const Country=mongoose.model('country',countrySchema);

module.exports=Country;