var should = require('should'),
    sinon = require('sinon');

var TemplateService = require('../services/templateService');

describe('Template Service Tests', function() {
    describe('Constructor Tests', function () {
        it('null param should throw error', function () {
            (function () { new TemplateService(null) }).should.throw();
        });
        it('empty string param should throw error', function () {
            (function () { new TemplateService("") }).should.throw();
        });

        //TODO: code should check on specific object type name
        it('object param should NOT throw error', function () {
            (function () { new TemplateService({}) }).should.not.throw();
        });

    });

    describe('GetById Tests', function(){
        it('null id should throw error', function(){
            var templateService = new TemplateService({});
            (function(){templateService.getById(null)}).should.throw();
        });

        it('empty string id should throw error', function(){
            var templateService = new TemplateService({});
            (function(){templateService.getById("")}).should.throw();
        });

        it('should call db.getData once', function(){
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { id: path};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'getData');
            var templateService = new TemplateService(fakeDb);
            var id = "testId";

            templateService.getById(id);
            sinon.assert.calledOnce(spy);
        });

        it('should call db.getData with correct argument', function(){
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { id: path};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'getData');
            var templateService = new TemplateService(fakeDb);
            var id = "testId";

            templateService.getById(id);
            (spy.calledWith('/templates/' + id)).should.be.true();
        });

        it('should return expected result', function(done){
            var id = "testId";
            var expected = { id: id };
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { id: "testId"};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'getData');
            var templateService = new TemplateService(fakeDb);
            templateService.getById(id)
                .then(function(result){
                    result.should.be.eql(expected);
                    done()
                })
                .catch(function(err){done(err);});
        });

        it('should replace placeholder variables', function(done){
            var id = "testId";
            var expected = { id: id, content: 'test calvin', hasVars: true };
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { id: "testId", content:"test [name]" ,hasVars:true};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var templateService = new TemplateService(fakeDb);
            templateService.getById(id, { "name": "calvin"})
                .then(function(result){
                    result.should.be.eql(expected);
                    done()
                })
                .catch(function(err){done(err);});
        })
    });

    describe('GetAll Tests', function(){
        it('should call db.getData once', function(){
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { id: path};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'getData');
            var templateService = new TemplateService(fakeDb);
            templateService.getAll();
            sinon.assert.calledOnce(spy);

        });

        it('should call db.getData with correct argument', function(){
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { id: path};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'getData');
            var templateService = new TemplateService(fakeDb);

            templateService.getAll();
            (spy.calledWith('/templates')).should.be.true();
        });

        it('should be able to transform result to array', function(done){
            var expected = {count: 1, items:[{ id:"testId", contentId:"1"}]};
            var FakeDb = function(){
                return {
                    getData : function(path){
                        return { testId: { contentId:"1"}};
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var templateService = new TemplateService(fakeDb);
            templateService.getAll()
                .then(function(result){
                    result.should.be.eql(expected);
                    done();
                })
                .catch(function(err){ done(err)});
        });
    });

    describe('AddTemplate Tests', function(){
        it('null template should throw error', function(){
            var templateService = new TemplateService({});
            (function(){templateService.addTemplate(null)}).should.throw();
        });

        it('empty template should throw error', function(){
            var templateService = new TemplateService({});
            (function(){templateService.addTemplate("")}).should.throw();
        });

        it('should call db.push once', function(){
            var FakeDb = function(){
                return {
                    push : function(path, data){
                        return data;
                    }
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'push');
            var templateService = new TemplateService(fakeDb);

            templateService.addTemplate({});
            sinon.assert.calledOnce(spy);
        });

        it('should call db.push with correct argument', function(){
            var FakeDb = function(){
                return {
                    push : function(path, template){}
                }
            };
            var fakeDb  = new FakeDb();
            var spy = sinon.spy(fakeDb, 'push');
            var templateService = new TemplateService(fakeDb);
            var expected = { contentId:1, localeCode:"en-us"};

            templateService.addTemplate(expected);
            (spy.calledWith('/templates/1_en-us', expected)).should.be.true();
        });

        it('should return correct Id', function(done){
            var FakeDb = function(){
                return {
                    push : function(path, template){}
                }
            };
            var fakeDb  = new FakeDb();
            var templateService = new TemplateService(fakeDb);
            var expected = { contentId:1, localeCode:"en-us"};

            templateService.addTemplate(expected)
                .then(function(result){
                    result.should.be.eql('1_en-us');
                    done();
                })
                .catch(function(err){done(err)});
        });
    });
});
