"use strict";
var Q = require('q');
var util = require('util');
var LOG_CATEGORY = "templateService.js";
var config = require('config');

var templateService = function(database){
	if(!database){
		var err = util.format("%s::Ctr -> failed:%s", LOG_CATEGORY,'database is required.');
		console.error(err);
		throw new Error(err);
	}
	var getAll = function(){
		var deferred = Q.defer();
		try{
			var data = database.getData("/templates");
			var keys = Object.keys(data);
			var items = [];
			for(var key in keys){
				var item  = { id: keys[key]};
				Object.assign(item, data[keys[key]]);
				items.push(item);
			}
			deferred.resolve({ count: items.length, items: items} );
		}catch(err){
			deferred.reject(err);
		}
		return deferred.promise;
	}

	var getById = function(id, customVars){
		if(!id){
			var err = util.format("%s::getById -> failed:%s", LOG_CATEGORY,'id cannot be null or empty');
			console.error(err);
			throw new Error(err);
		}
		var deferred = Q.defer();
		try{
			var data = database.getData("/templates/" + id );
			if(data.hasVars){
				var content = data.content;
				var allVars = Object.assign({}, config.globalVars, customVars);
				var keys = Object.keys(allVars);
				for(var key in keys){
					var placeHolder = util.format("[%s]", keys[key]);
					var value = allVars[keys[key]];
					content = content.replace(placeHolder, value);
				}
				data.content = content;
			}

			deferred.resolve(data);
		}catch(err){
			if(err.name && err.name === "DataError"){
				deferred.resolve(null); //not found
			}
			deferred.reject(err);
		}
		return deferred.promise;
	}

	var addTemplate = function(template){
		if(!template){
			var err = util.format("%s::addTemplate -> failed:%s", LOG_CATEGORY,'template cannot be null or empty');
			console.error(err);
			throw new Error(err);
		}
		var deferred = Q.defer();
		try{
			var id = template.contentId + "_" + template.localeCode;
			database.push("/templates/" + id, template);

			deferred.resolve(id);
		}catch(err){
			deferred.reject(err);
		}
		return deferred.promise;
	}

	return{
		getAll : getAll,
		getById : getById,
		addTemplate : addTemplate
	}
}

module.exports = templateService;