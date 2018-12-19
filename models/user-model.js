const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bcrypt=require('bcryptjs');

let userSchema=new Schema({
    outlookId: {type: String,required:false},
    username:{type: String,required:true},
    email:{type: String,required:false},
    comname:{type: String,required:false},
    password:{type: String,required:false}

});




const User=mongoose.model('user',userSchema);

module.exports=User;



module.exports.getUserByUsername=function(username,callback){
    const query={username:username}
    User.findOne(query,callback);

  }

  module.exports.getUserById=function(id,callback){
    //const query={username:username}
    User.findById(id,callback);

  }


  module.exports.comparePassword=function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
     if (err) throw err;
     callback(null,isMatch);
  });
  }