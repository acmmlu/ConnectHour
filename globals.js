const mysql = require('mysql2');
const nodemailer = require('nodemailer');

// Create a connection to DB
exports.pool = mysql.createPool({
    connectionLimit: 100,
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
        user: "connecthourofficial@gmail.com",
        pass: "P565Group2"
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
