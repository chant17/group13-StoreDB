var passport = require('passport');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Passport Session Setup:
const pool = mysql.createConnection({
    connectionLimit: 10,
    host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'dw4h1mb7skn1bu0n',
    password: 'z31mjqf5qy22tlbm',
    database: 'woivccvvos2pfj3e'
});

function getConnection() {
    return pool;
};

connection.query('USE woivccvvos2pfj3e');

const authenticateUser = (email, password, done) => {
    const user = getUserByEmail(email)
    if(user == null) {
        return done(null, false, { message: 'No user with that email' })
    }

    try {
        if(await bcrypt.compare(password, )) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Your username or password is incorrect'});
        }
    } catch (e) {
        return done(e);
    }
}

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        let sql = 'SELECT * FROM customer WHERE membership_ID = '+id;
       connection.query(sql, (err, rows) => {
           done(err, rows[0]);
       });
    });

    // Local Login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        connection.query("SELECT * FROM 'customer' WHERE 'username' = '" + username + "'", (err, rows) => {
            if(err)
            return done(err);
            if(!rows.length) {
                return done(null, false, req.flash('loginMessage', 'Invalid Username or Password'));
            }

            if(!(rows[0].password == password))
                return done(null, false, req.flash('loginMessage', 'Invalid Username or Password'));

            return done(null, rows[0]);
        });
    }));
};