const mongoose=require('mongoose');
const Schema=mongoose.Schema;



let insertedcountrySchema=new Schema({
    countryname: {type: String,required:true}

});

const InCountry=mongoose.model('incountry',insertedcountrySchema);

module.exports=InCountry;