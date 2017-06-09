"use strict";
var util = require('util');
var responseHandler = require('../helpers/responseHandler');
var LOG_CATEGORY = "templateController.js";

//allow dependency injection on templateModel for easier testability
var templateController = function(templateService){
	if(!templateService){
		//todo: should use a better logger mechanism
		var err = util.format("%s::Ctr -> failed:%s", LOG_CATEGORY,'templateService is required.');
		console.error(err);
		throw new Error(err);
	}
	
	var getById = function(req,res, next){
		//tracing
		console.log(util.format("%s::getById -> enter method. Id: %s", LOG_CATEGORY, req.params.id));
		templateService.getById(req.params.id, req.query)
			.then(function(result){
				res.json(result);
			})
			.catch(function(err){
				next(err);
			});
	}
	
	var getAll = function(req, res, next){
		console.log(util.format("%s::getAll -> enter method", LOG_CATEGORY));
		templateService.getAll()
			.then(function(result){
				responseHandler.okResponseHandler(result, req, res, next);
			})
			.catch(function(err){
				console.error(err);
				responseHandler.unexpectedErrorHandler(err, req, res, next);
			});
	}

	var addTemplate = function(req, res, next){
		console.log(util.format("%s::addTemplate -> enter method", LOG_CATEGORY));
		templateService.addTemplate(req.body)
			.then(function(result){
				responseHandler.okResponseHandler(result, req, res, next);
			})
			.catch(function(err){
				console.error(err);
				responseHandler.unexpectedErrorHandler(err, req, res, next);
			});
	}
	
	//revealing pattern
	return {
		getById: getById,
		getAll: getAll,
		addTemplate: addTemplate
	}
};

module.exports = templateController;