"use strict";

var express = require('express');
var packageJSON = require('../package');
var domainMiddleware = require('express-domain-middleware');
var router = express.Router();
//var requestStats = require('request-stats');
var responseHandler = require('../helpers/responseHandler');

var routes = function () {

    //Check if response is already sent
    router.use(function (req, res, next) {
        var _send = res.send;
        var sent = false;
        res.send = function (data) {
            if (sent) {
                return;
            }
            _send.bind(res)(data);
            sent = true;
        };
        next();
    });

    router.use(domainMiddleware);

    //favicon issue : Browser tries to make favicon.ico request
    router.use('/favicon.ico', function (req, res) {
        res.end();
    });

	//log per request stats
	//router.use(requestStats);

    //Initialize status & version check
    console.log('Init - status check route');
    router.get('/templates/statusCheck', function (req, res, next) {
       responseHandler.okResponseHandler(packageJSON.version, req, res, next);

    });

    /*This will be used for Authentication*/
    //router.use(authorize, function (req, res, next) {
    //    next();
    //});
    var JsonDB = require('node-json-db');
    var db = new JsonDB('data/templates', true,false);
    var templateService = require('../services/templateService')(db);

    var templateController = require('../controllers/templateController')(templateService);
    router.route('/templates')
        .get(templateController.getAll)
        .post(templateController.addTemplate);

    router.route('/templates/:id')
        .get(templateController.getById);

    console.log('Init - log error handler');
    router.use(function (err, req, res, next) {

        if (err) {
            console.error(err);
            next(err);
        }
        else
            next();
    });

    //Check Invalid routes
    router.use('/*', responseHandler.invalidRouteHandler);

    //Inititalize Error handler
    console.log('Init - unexpected error handler');
    router.use(responseHandler.unexpectedErrorHandler);

    router.use(function (req, res) {
        res.end();
    });

    return router;
};

//TODO: placeholder for authorization
var authorize = function (req, res, next) {
    try {

    }
    catch (err) {
        next(err);
    }
};

module.exports = routes;