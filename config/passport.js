var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var dbconfig = require('/db');
var connection = mysql.createConnection(dbconfig.connection);

connection.connect();
connection.query('USE woivccvvos2pfj3e');
connection.end(); // new

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
       connection.query('SELECT * FROM customer WHERE membership_ID = ?', [id], (err, rows) => {
           done(err, rows[0]);
       });
       connection.end();
    });

    // Local Login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        connection.connect();
        connection.query("SELECT * FROM 'customer' WHERE 'username' = ?", [username], (err, rows) => {
            if(err)
                return done(err);
            if(!rows.length) { // ! or !! (?)
                return done(null, false, req.flash('loginMessage', 'Invalid Username or Password'));
            }
            if(!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, req.flash('loginMessage', 'Invalid Username or Password'));

            return done(null, rows[0]);
        });
        connection.end();
    }));
};