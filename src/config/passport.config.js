const passport = require('passport');
const github = require('passport-github2')
// const SpotifyStrategy = require('passport-spotify').Strategy;
const UserModel = require('../dao/db/models/users.model')
const config = require("./config")

const initPassport = () => {
    passport.use('github', new github.Strategy(
        {
            clientID: config.GITHUB_CLIENTID,
            clientSecret: config.GITHUB_SECRET,
            callbackURL: `http://localhost:${config.PORT}/api/sessions/callback`
        },
        async ( accessToken, refreshToken, profile, done)=> {
            try{
                let {name, email} = profile._json;
                let user = await UserModel.findOne({email});
                
                if(!user){                    
                    user = await UserModel.create({
                        first_name: name,
                        email,
                        profilePicture: profile._json.avatar_url,
                        github: profile
                    });
                } else {
                    user.first_name = name;
                    user.profilePicture = profile._json.avatar_url;
                    user.github = profile;
                    user.last_connection = new Date();
                    await user.save();
                }

                return done(null, user)
            } catch(error)  {
                return done(error)
            }
        }
    ))
}

passport.serializeUser((user, done)=>{
    done(null, user);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
})

module.exports = initPassport;