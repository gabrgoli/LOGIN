require('dotenv').config();
const Server = require('./server');



const express = require("express");
const cors = require("cors");


const passport=require("passport")
const FacebookStrategy = require("passport-facebook").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const TwitchStrategy = require("passport-twitch.js").Strategy;
const keys = require("./config");
//const chalk = require("chalk");


const server = new Server();


let user = {};

const app = express();
app.use(cors());
app.use(passport.initialize());

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK.clientID,
    clientSecret: keys.FACEBOOK.clientSecret,
    callbackURL: "/auth/facebook/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log((JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Github Strategy
passport.use(new GithubStrategy({
    clientID: keys.GITHUB.clientID,
    clientSecret: keys.GITHUB.clientSecret,
    callbackURL: "/auth/github/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log((JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
    callbackURL: "/auth/google/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log((JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));

// Instagram Strategy
passport.use(new InstagramStrategy({
    clientID: keys.INSTAGRAM.clientID,
    clientSecret: keys.INSTAGRAM.clientSecret,
    callbackURL: "/auth/instagram/callback"
},
(accessToken, refreshToken, profile, cb) => {
    console.log((JSON.stringify(profile)));
    user = { ...profile };
    return cb(null, profile);
}));





app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
        res.redirect("/profile");
    });

app.get("/auth/github", passport.authenticate("github"));
app.get("/auth/github/callback",
    passport.authenticate("github"),
    (req, res) => {
        res.redirect("/profile");
    });

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));
app.get("/auth/google/callback",
    passport.authenticate("google"),
        (req, res) => {
            res.redirect("/profile");
        });

app.get("/auth/instagram", passport.authenticate("instagram"));
app.get("/auth/instagram/callback",
    passport.authenticate("instagram"),
        (req, res) => {
            res.redirect("/profile");
        });

app.get("/auth/twitch", passport.authenticate("twitch.js"));
app.get("/auth/twitch/callback",
    passport.authenticate("twitch.js"),
        (req, res) => {
            res.redirect("/profile");
        });

app.get("/user", (req, res) => {
    console.log("getting user data!");
    res.send(user);
});

app.get("/auth/logout", (req, res) => {
    console.log("logging out!");
    user = {};
    res.redirect("/");
});





server.listen();