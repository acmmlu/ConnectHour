const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const url = require('url');
const {google} = require('googleapis');

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    '926515268553-bb97lrsb78c4d3ms5auuuu33sq6vdr2i.apps.googleusercontent.com',
    'HrETbf3xcyhGLU-R4pH_ma9b',
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
        clientId: 'http://926515268553-bb97lrsb78c4d3ms5auuuu33sq6vdr2i.apps.googleusercontent.com',
        clientSecret: 'HrETbf3xcyhGLU-R4pH_ma9b',
        refreshToken: '1//04Sy1I7rretquCgYIARAAGAQSNwF-L9Irc0AamoaF6wH1Rssv671PU3KXswEt7Z1tvNvWj5LQi_79o05LBsREChBKPfgUupO4z1o',
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
