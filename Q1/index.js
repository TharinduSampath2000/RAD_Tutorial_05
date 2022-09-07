const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const passportLocal = require("passport-local");
const data = require("./userData");
const popup = require("node-popup/dist/cjs.js");
const alert = require("alert");

const app = express();

const localStrategy = new passportLocal.Strategy({
    usernameField: "email"
}, (email, password, done) => {
    const user = data.users.find((user) => {
        if(user.email == email){
            return true;
        }else{
            return false;
        }
    });

    if(!user){
        alert("Login failed!!\nThis email doesn't match with any account.");
        return done(null,false);
    }else{
        if(user.password !== password){
            alert("Incorrect password.");
            return done(null, false);
        }else{
            return done(null, user.email);
        }
    }
});

passport.use(localStrategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((email, done) => {
    console.log(email);
    done(null, email);
});

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static("stylesheet"));

app.use(session({
    secret: "ThisIsTheSecretCodeForDemostration",
    Cookie: {
        maxAge: 300000,
        httpOnly: true
    },
    saveUninitialized: true,
    resave: false
}));

app.use(express.urlencoded({extended:false}));


app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/index", (req, res) => {
    console.log(req.isAuthenticated());
    if(!req.session.pageVisitCount){
        req.session.pageVisitCount = 1;
    }else{
        req.session.pageVisitCount++;
    }

    res.render("index", {
        count: req.session.pageVisitCount
    });
});

app.post("/login", passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/index"
}));

app.post("/logout", (req, res) => {
    req.logout(() => {
        req.session.pageVisitCount = 0;
        res.redirect("/");
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}\nVisit: http://localhost:${PORT}`);
}); 

