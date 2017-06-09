'use strict';

var HTTP_STATUS = require('http-status');

var errorObj = function(){

}
errorObj.prototype = Object.create(Error.prototype);

var unexpectedErrorHandler = function (err, req, res, next) {

    try {
        Error.captureStackTrace(errorObj);
        try {
            addCommonResponseHeaders(req, res);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR);
            res.json({
                code: "SERVER_ERROR",
                message: err.message ? err.message : JSON.stringify(err),
                stacktrace: err.stack ? err.stack : errorObj.stack
            });
            res.end();
        }
        catch (err) {
            next(err);
        }
    }
    catch (err) {
        next(err);
    }
};

var badRequestErrorHandler = function (req, res, next) {
    try {
        addCommonResponseHeaders(req, res);
        res.status(HTTP_STATUS.BAD_REQUEST);
        res.json({
		code: "NOT_FOUND",
		message: "Resource not found"
		});
        res.end();
    }
    catch (err) {
        next(err);
    }
};

var invalidRouteHandler = function(req, res, next){
    try {
        addCommonResponseHeaders(req, res);
        res.status(HTTP_STATUS.BAD_REQUEST);
        res.json({
            code: "INVALID_ROUTE",
            message: "Invalid service URI"
        });
        res.end();
    }
    catch (err) {
        next(err);
    }
}

var okResponseHandler = function (result, req, res, next) {
    try {
        addCommonResponseHeaders(req, res);
        res.status(HTTP_STATUS.OK);
        res.json(result);
        res.end();
    }
    catch (err) {
        next(err);
    }
};

var addCommonResponseHeaders = function (req, res) {
    if (!res)
        return;
    //modify common response headers..
    res.removeHeader('X-Powered-By');
    //server reponse should always be no cache
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');

};

/*Module exports*/
var responseHandlers = function () {
    return {
        unexpectedErrorHandler: unexpectedErrorHandler,
        badRequestErrorHandler: badRequestErrorHandler,
        okResponseHandler: okResponseHandler,
        invalidRouteHandler: invalidRouteHandler
    };
};

module.exports = responseHandlers();
