const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const g = require('./globals');

const app = express();
const port = 40951;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const server = app.listen(port,  function () {
    console.log('Navigate to silo.sice.indiana.edu:'+port);
});

require('./routes')(app);