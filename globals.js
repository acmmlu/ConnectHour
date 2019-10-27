const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const url = require('url');


// Create a connection to DB
exports.pool = mysql.createPool(process.env.DATABASE_URL);

exports.transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "connecthourofficial@gmail.com",
        pass: process.env.GMAIL_PASS
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
