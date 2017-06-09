'use strict';

process.on('uncaughtException', function (e) {
    console.log("uncaught Exception: " + e.stack);	
});

console.log('Init - Application Start');
//Initialize variables
//set config path
var path = require('path');
process.env.NODE_CONFIG_DIR = path.resolve('./config');

var express = require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var routes = require('./routes/routes');
var config = require('config');
var port = process.env.PORT || config.port;
var cors = require('cors');

//Initialize cors
app.use(cors());

console.log('Init - cors');

//Initialize body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(routes());

//Lisent to port
var server = app.listen(port, function () {
    console.log('Service is Running on Port:' + port);
});

server.timeout = 600000;