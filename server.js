const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const g = require('./globals');

const app = express();
const port = process.env.PORT || 40951;


app.use(express.static(path.join(__dirname, 'react_app', 'public')));
app.use(fileUpload({limits: { fileSize: 65535}}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const server = app.listen(port, "0.0.0.0", function () {
    console.log('Navigate to silo.sice.indiana.edu:'+port);
});

require('./routes')(app);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'react_app', 'build')));

    // Render home page for any route not specified in routes.js
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'react_app', 'build', 'index.html'));
    });
} else {
    app.use(express.static(path.join(__dirname, 'react_app', 'public')));
}