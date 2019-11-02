const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const url = require('url');


// Create a connection to DB
exports.pool = mysql.createPool(process.env.DATABASE_URL);

exports.transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'oauth2',
        user: 'connecthourofficial@gmail.com',
        clientId: '926515268553-702nh6okk23jl79j8dkikfe2sliopt1r.apps.googleusercontent.com',
        clientSecret: 'jNlAfC11q9dPa1gm-Ofqq9h9',
        refreshToken: '1//04_JmqiS7Xo-eCgYIARAAGAQSNwF-L9IrUhUUSvzFm8GF4HahCYbZxWcW0wM5EHjcFFHIz783TQKMbNIg0pxTE-CoTaqivC5Hdbo',
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
