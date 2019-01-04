const passport=require('passport');
const keys=require('./keys');
const User=require('../models/user-model');
const OutlookStrategy=require('passport-outlook');
const ComFun=require('../extraFunctions/myAuxFuns');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);

});

///deserializing

passport.deserializeUser((id,done)=>{
    
    User.findById(id).then((user)=>{
        done(null,user);

    });
    
});


passport.use(new OutlookStrategy({
            clientID: keys.outlook.clientID,
            clientSecret: keys.outlook.clientSecret,
            callbackURL: 'https://arcane-tor-27655.herokuapp.com/auth/outlook/callback'
            //callbackURL: '/auth/outlook/callback'
          },
          function(accessToken, refreshToken, profile, done) {
            // console.log("Callback Function Fired from outlokk"+JSON.stringify(profile));
            // console.log("Username "+profile._json.DisplayName);
            // console.log("User Profile Id "+profile._json.Id);
            // console.log("User Profile mail "+profile._json.EmailAddress);
            
            
            var user = {
                outlookId: profile._json.Id,
                name: profile._json.DisplayName,
                email: profile._json.EmailAddress,
                comname:ComFun.getUserDetail(profile._json.DisplayName)
               // accessToken:  accessToken
            };
            // if (refreshToken)
            //   user.refreshToken = refreshToken;
            // if (profile.MailboxGuid)
            //   user.mailboxGuid = profile.MailboxGuid;
            // if (profile.Alias)
            //   user.alias = profile.Alias;

            // User.findOrCreate(user, function (err, user) {
            //   return done(err, user);
            // });

               //check if user already exists in our db
               User.findOne({outlookId:user.outlookId}).then((currentUser)=>{
                if(currentUser){
                   //already hv d user
                   console.log('user is '+currentUser);
                   //serializing the user
                    done(null,currentUser);
                }
                else{
                    //if nt, create new user in db
                     
                     
                      new User({
                 
                          outlookId:user.outlookId,
                          username:user.name,
                          email:user.email,
                          comname:user.comname

                      }).save().then((newUser=>{
                          console.log('User Created '+newUser);
                          //res.render('/');

                          //again serializing

                           done(null,newUser);
                      }));
                      

                  }
            });
          
           
          }
        ));




//local strategy

passport.use(new LocalStrategy((username,password,done)=>{
    User.getUserByUsername(username,(err,user)=>{
         if (err) throw err;
         if(!user){
             return done(null,false,{message:'Invalid Username'});
         }
        User.comparePassword(password,user.password,(err,isMatch)=>{
         if (err) throw err;
         if(isMatch){
             return done(null,user);
         }else{
             return done(null,false,{message:'Wrong Password !!'});
         }
        });
    });
  }));
 //local strategy

passport.use(new LocalStrategy((username,password,done)=>{
  User.getUserByUsername(username,(err,user)=>{
       if (err) throw err;
       if(!user){
           console.log('Invalid Username');
           return done(null,false,{message:'Invalid Username'});
       }
      User.comparePassword(password,user.password,(err,isMatch)=>{
       if (err) throw err;
       
       if(isMatch){
           console.log('Password Match');
         
           return done(null,user);
       }else{console.log('Wrong Password !!');
           return done(null,false,{message:'Wrong Password !!'});
       }
      });
  });
}));
 
