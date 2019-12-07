const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const url = require('url');
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
   refresh_token: process.env.REFRESH_TOKEN
});
// Create a connection to DB



exports.google = google;
exports.pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 1000,
    user: "p565f19_lalovett",
    host: "db.sice.indiana.edu",
    password: "my+sql=p565f19_lalovett",
    database: "p565f19_lalovett"
});
exports.transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "connecthourofficialv2@gmail.com",
        pass: "Connect@Hour2"
    }
});

exports.query = function(query, params, onSuccess) {
    try {
        exports.pool.getConnection(function (err, connection) {
            if (err) throw err;

            connection.execute(query, params, function (err, result, fields) {
                if (err) throw err;
                onSuccess(result, fields);
            });
        });
    } catch (error) {
        res.status(422);
        console.log(error);
    }
} 
