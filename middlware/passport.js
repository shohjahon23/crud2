const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const dbUser  = require('../model/User')

module.exports = async (passport) => {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            dbUser.findOne({ login: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
       
            bcrypt.compare(password, user.password, (err, match) => {
                if(err){
                    console.log(err);
                }
                if(match){
                    done(null, user)
                }else{
                    done(null, false, {message : "Error"})
                }
            })
          });
        }
      ));
      passport.serializeUser(function(users, done) {
        done(null, users.id);
      });
      passport.deserializeUser(function(id, done) {
        dbUser.findById(id, function(err, users) {
          done(err, users);
        });
      });
}