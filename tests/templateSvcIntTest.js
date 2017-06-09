var should = require('should'),
    request = require('supertest'),
    app = require('../app.js'),
    agent = request.agent(app);

describe('Templates Service Integration Tests', function(){
    describe('/templates int tests', function(){
        it('should return http 200', function(done){
            agent.get('/templates')
                .end(function(err, result){
                    if(err){
                        done(err);
                    }else{
                        result.status.should.be.eql(200);
                        done();
                    }
                });
        });

        it('should return http 404', function(done){
            agent.get('/templates/idnotexist')
                .end(function(err, result){
                    result.status.should.be.eql(404);
                    done();
                })
        })
    })
})
