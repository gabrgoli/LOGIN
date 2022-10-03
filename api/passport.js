const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const Usuario = require('./models/usuario');

const InstagramStrategy = require("passport-instagram").Strategy;
const keys = require("./config");

const GOOGLE_CLIENT_ID =
  "your id";
const GOOGLE_CLIENT_SECRET = "your id";

GITHUB_CLIENT_ID = "ba40056ec4543a9d3d7b";
GITHUB_CLIENT_SECRET = "f2b370bc3d456b1c5e3d58b350d7a146c7b33bbf";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";

/*passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);*/

passport.use(new GithubStrategy(
    {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET  ,
        callbackURL: "/api/usuarios/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile)
       return done(null, profile);
       //Usuario.findOrCreate({ githubId: profile.id }, function (err, user) {
       // return done(err, user);
    //}
   // );
    }
  )
);

// Instagram Strategy
passport.use(new InstagramStrategy(
      {
          clientID: keys.INSTAGRAM.clientID,
          clientSecret: keys.INSTAGRAM.clientSecret,
          callbackURL: "/api/usuarios/instagram/callback"
      },
      (accessToken, refreshToken, profile, cb) => {
          console.log((JSON.stringify(profile)));
          user = { ...profile };
          return cb(null, profile);
      }));

// Facebook Strategy
passport.use(new FacebookStrategy(
    {
      clientID: keys.FACEBOOK.clientID,
      clientSecret: keys.FACEBOOK.clientSecret,
      callbackURL: "/api/usuarios/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      //done(null, accessToken);
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
    });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});