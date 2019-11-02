const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const url = require('url');
const {google} = require('googleapis');

const OAuth2 = google.auth.OAuth2;
const oath2Client = new OAuth2(
    '926515268553-702nh6okk23jl79j8dkikfe2sliopt1r.apps.googleusercontent.com',
    'jNlAfC11q9dPa1gm-Ofqq9h9',
    'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({
   refresh_token: '1//04_JmqiS7Xo-eCgYIARAAGAQSNwF-L9IrUhUUSvzFm8GF4HahCYbZxWcW0wM5EHjcFFHIz783TQKMbNIg0pxTE-CoTaqivC5Hdbo' 
});

// Create a connection to DB
exports.pool = mysql.createPool(process.env.DATABASE_URL);

exports.transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'connecthourofficial@gmail.com',
        clientId: '926515268553-702nh6okk23jl79j8dkikfe2sliopt1r.apps.googleusercontent.com',
        clientSecret: 'jNlAfC11q9dPa1gm-Ofqq9h9',
        refreshToken: '1//04_JmqiS7Xo-eCgYIARAAGAQSNwF-L9IrUhUUSvzFm8GF4HahCYbZxWcW0wM5EHjcFFHIz783TQKMbNIg0pxTE-CoTaqivC5Hdbo',
        accessToken: oauth2Client.getAccessToken(),
        expires: (new Date()).getTime()
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
