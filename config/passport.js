// Dev Reference: https://gist.github.com/manjeshpv/84446e6aa5b3689e8b84
var passport = require('passport');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;

// Passport Session Setup:

// Commented out some attributes of 'mysql.createPool' before switching to 'mysql.createConnection'
// Might be needed if this does not work
const pool = mysql.createConnection({
    // connectionLimit: 10,
    host: 'sulnwdk5uwjw1r2k.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'dw4h1mb7skn1bu0n',
    password: 'z31mjqf5qy22tlbm'
    // database: 'woivccvvos2pfj3e'
});

function getConnection() {
    return pool;
};

connection.query('USE woivccvvos2pfj3e');

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

    // Local Signup
    passport.use('local-signup', new LocalStrategy({
        firstnameField: 'firstname',
        lastnameField: 'lastname',
        emailField: 'email',
        usernameField: 'username',
        passwordField: 'password',
        phonenumField: 'phonenumber',
        addressField: 'address1',
        addressField2: 'address2',
        cityField: 'city',
        stateField: 'state',
        zipField: 'zip',
        countryField: 'country',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        connection.query("SELECT FROM customer WHERE username = '"+ username +"'", (err, rows) => {
                console.log(rows);
                console.log('above row object');
                if(err) {
                    console.log("Failed to create user: " + err);
                    res.sendStatus(500);
                    return;
                }
                if(rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is not available.'));
                } else {
                    var newUserMySQL = new Object();
                        newUserMySQL.firstname = firstname;
                        newUserMySQL.lastname = lastname;
                        newUserMySQL.email = email;
                        newUserMySQL.username = username;
                        newUserMySQL.password = password;
                        newUserMySQL.phonenumber = phonenumber;
                        newUserMySQL.address = address;
                        newUserMySQL.address2 = address2;
                        newUserMySQL.city = city;
                        newUserMySQL.state = state;
                        newUserMySQL.zip = zip;
                        newUserMySQL.country = country;

                    var insertQuery = "INSERT INTO customer ( first_name, last_name, email, username, password, phone_number, address1, address2, city, state, zip_code, country ) values ('" + firstname +"','"+ lastname +"','" + email +"','"+ username +"','" + password +"','"+ phonenumber +"','" + address +"','"+ address2 +"','" + city +"','"+ state +"','" + zip +"','"+ country +"')";
                    console.log(insertQuery);
                    connection.query(insertQuery, (err, rows) => {
                        newUserMySQL.id = rows.insertId;

                        return done(null, newUserMySQL);
                    });
                }
        });
    }));

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