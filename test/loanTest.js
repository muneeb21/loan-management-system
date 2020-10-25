// Set node evnironment as test.
process.env.NODE_ENV = 'test';

// Require models
const User = require('../models/user');
const Loan = require('../models/loan');
const jwt=require('jsonwebtoken');
// const bcrypt=require('bcryptjs');
// require all the dependencies for testing 
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
chai.use(chaiHttp);




// Test for all the customer related functionalities.
describe('CUSTOMER', () => {
    let authToken = "";
    let user = "";
   
    // Empty all the collections and add a dummy user to generate jwt
    afterEach((done) => {
        
        Loan.deleteOne({}, (err) => {
        });
    
        User.deleteOne({}, (err) => {
             user = new User({ name: "customer", email: "customer1", password: "customer1",phone:"0987545546",userType:"customer",isApproved:true });
            user.save((err, user) => {
                authToken = jwt.sign(user.toJSON(), "codeial", { expiresIn: 100000 })
                done();
            })
        });
    });



    // Test to make a new loan request
    describe('/POST user/loan/newLoan', () => {
        

        // Authorization failed due to not passing jwt token in header
        it('it should return a message not Authorized -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ` })
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    
                    
                    done();
                });
        });

        
       

        // Make a loan request successfully 
        it('It should make a loan request successfully -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({"principle":"15000","monthsToRepay":"10"})
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(200);
                    
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Loan request made successfully');
                    res.body.should.have.property('data');
                    
                    
                    done();
                });
        });
        
        

        // Requesting loan request with smaller principle amount

        it('It should not make a loan request -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({"principle":"1500","monthsToRepay":"10"})
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(422);
                    
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Enter a valid amount');
                                   
                    
                    done();
                });
        });


    });



// Listing all loans

   describe('/GET user/loan/allLoans', () => {
        

    // Authorization failed due to not passing jwt token in header
    it('it should return a message not Authorized -> LIST LOANS', (done) => {
        chai.request(server)
            .get('/user/loan/allLoans')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(401);
                res.body.should.be.a('object');
                
                
                done();
            });
    });

    
   

    // List all the loans successfully
    it('It should list all the loans successfully -> LIST LOANS', (done) => {
        chai.request(server)
            .get('/user/loan/allLoans')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ${authToken}` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Here is the list of loans');
                res.body.should.have.property('data');
                
                
                done();
            });
    });
    
   

    


});
 
     

       // Listing all loans

   describe('/POST user/loan/loansbyFilter', () => {
        

    // Authorization failed due to not passing jwt token in header
    it('it should return a message not Authorized -> FILTER LOANS', (done) => {
        chai.request(server)
            .post('/user/loan/loansbyFilter')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(401);
                res.body.should.be.a('object');
                
                
                done();
            });
    });

    
   

    // List all the loans according to a filter successfully
    it('It should list all the loans successfully according to a filter-> FILTER LOANS', (done) => {
        chai.request(server)
            .post('/user/loan/loansbyFilter')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ${authToken}` })
            .send({status:"NEW"})
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(422);
                
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Unauthorised user or there are no loans to show!');
                
                
                
                done();
            });
    });
    

    


});
  

   

});







// Test for all the approved agent related functionalities.
describe('AGENT', () => {
    let authToken = "";
    let user = "";
   
    // Empty all the collections and add a dummy user to generate jwt
    afterEach((done) => {
        
        Loan.deleteOne({}, (err) => {
        });
    
        User.deleteOne({}, (err) => {
             user = new User({ name: "agent", email: "agent", password: "agentpass",phone:"098754554612",userType:"agent",isApproved:true });
            user.save((err, user) => {
                authToken = jwt.sign(user.toJSON(), "codeial", { expiresIn: 100000 })
                done();
            })
        });
    });



    // Test to make a new loan request
    describe('/POST user/loan/newLoan', () => {
        

        // Authorization failed due to not passing jwt token in header
        it('it should return a message not Authorized***** -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ` })
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    
                    
                    done();
                });
        });

        
       

        // Make a loan request successfully if Agent is approved there exists a user with an email
        it('It should make a loan request successfully -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({email:"ascfg",principle:"15000","monthsToRepay":"10"})
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(422);
                    
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Loan request cannot be made');
                    // res.body.should.have.property('data');
                    
                    // res.body.data.should.have.property('agents');
                    done();
                });
        });
        

        // Requesting loan request with smaller principle amount

        it('It should not make a loan request -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({"principle":"1500","monthsToRepay":"10"})
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(422);
                    
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Enter a valid amount');
                                   
                    
                    done();
                });
        });


    });



// Listing all loans

   describe('/GET user/loan/allLoans', () => {
        

    // Authorization failed due to not passing jwt token in header
    it('it should return a message not Authorized -> LIST LOANS', (done) => {
        chai.request(server)
            .get('/user/loan/allLoans')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(401);
                res.body.should.be.a('object');
                
                
                done();
            });
    });

    
   

    // List all the loans successfully
    it('It should list all the loans successfully -> LIST LOANS', (done) => {
        chai.request(server)
            .get('/user/loan/allLoans')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ${authToken}` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Here is the list of loans');
                res.body.should.have.property('data');
                
                
                done();
            });
    });
    
    

    


});
 
     

       // Listing all loans

   describe('/POST user/loan/loansbyFilter', () => {
        

    // Authorization failed due to not passing jwt token in header
    it('it should return a message not Authorized -> FILTER LOANS', (done) => {
        chai.request(server)
            .post('/user/loan/loansbyFilter')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(401);
                res.body.should.be.a('object');
                
                
                done();
            });
    });

    
   

    // List all the loans according to a filter successfully
    it('It should list all the loans successfully according to a filter-> FILTER LOANS', (done) => {
        chai.request(server)
            .post('/user/loan/loansbyFilter')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ${authToken}` })
            .send({status:"NEW"})
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Here is the list of loans according to a status');
                res.body.should.have.property('data');
                
                
                done();
            });
    });
    
    

    


});
  

   

});

// Test for not approved agent related functionalities.
describe('AGENT', () => {
    let authToken = "";
    let user = "";
   
    // Empty all the collections and add a dummy user to generate jwt
    afterEach((done) => {
        
        Loan.deleteOne({}, (err) => {
        });
    
        User.deleteOne({}, (err) => {
             user = new User({ name: "agent", email: "agent", password: "agentpass",phone:"098754554612",userType:"agent",isApproved:false });
            user.save((err, user) => {
                authToken = jwt.sign(user.toJSON(), "codeial", { expiresIn: 100000 })
                done();
            })
        });
    });



    // Test to make a new loan request
    describe('/POST user/loan/newLoan', () => {
        

        // Authorization failed due to not passing jwt token in header
        it('it should return a message not Authorized -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ` })
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    
                    
                    done();
                });
        });

        
       

        // Make a loan request successfully if Agent 
        it('It should make a loan request successfully -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({email:"ascfg",principle:"15000","monthsToRepay":"10"})
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(422);
                    
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Loan request cannot be made');
                    
                    done();
                });
        });
        
        

        // Requesting loan request with smaller principle amount

        it('It should not make a loan request -> LOAN REQUEST', (done) => {
            chai.request(server)
                .post('/user/loan/newLoan')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set({ "Authorization": `Bearer ${authToken}` })
                .send({"principle":"1500","monthsToRepay":"10"})
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(422);
                    
                    res.body.should.have.property('message');
                    res.body.message.should.be.eql('Enter a valid amount');
                                   
                    
                    done();
                });
        });


    });



// Listing all loans

   describe('/GET user/loan/allLoans', () => {
        

    // Authorization failed due to not passing jwt token in header
    it('it should return a message not Authorized -> LIST LOANS', (done) => {
        chai.request(server)
            .get('/user/loan/allLoans')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(401);
                res.body.should.be.a('object');
                
                
                done();
            });
    });

    
   

    // List all the loans successfully only if agent approved
    it('It should list all the loans successfully -> LIST LOANS', (done) => {
        chai.request(server)
            .get('/user/loan/allLoans')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ${authToken}` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(422);
                
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Unauthorised user!');
                
                
                
                done();
            });
    });
    
    

    


});
 
     

       // Listing all loans

   describe('/POST user/loan/loansbyFilter', () => {
        

    // Authorization failed due to not passing jwt token in header
    it('it should return a message not Authorized -> FILTER LOANS', (done) => {
        chai.request(server)
            .post('/user/loan/loansbyFilter')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ` })
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(401);
                res.body.should.be.a('object');
                
                
                done();
            });
    });

    
   

    // List all the loans according to a filter successfully if agent approved
    it('It should list all the loans successfully according to a filter-> FILTER LOANS', (done) => {
        chai.request(server)
            .post('/user/loan/loansbyFilter')
            .set('content-type', 'application/x-www-form-urlencoded')
            .set({ "Authorization": `Bearer ${authToken}` })
            .send({status:"NEW"})
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(422);
                
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Unauthorised user or there are no loans to show!');
                
                
                
                done();
            });
    });
    
  

    


});
  

   

});





