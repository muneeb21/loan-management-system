// Set node evnironment as test.
process.env.NODE_ENV = 'test';

// Require models
const User = require('../models/user');
// const bcrypt=require('bcryptjs');
// require all the dependencies for testing 
const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');

const should = chai.should();
chai.use(chaiHttp);

const hashedPwd="$2a$10$wqCKqVHsoTJ9NKCaxwZYR.lYJhzjbA6DqzFysizR1t4iYTUcTL9.u";
// const bcrypt=require('bcryptjs');
// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("TestPass", salt, function(err, hash) {
//         if(err){
//             console.log(err);
//             return;
//         }
//         else{
//           var hashedPwd=hash;
//             return;
            
//         }
//     });
// });

// console.log('******************8',hashedPwd);

describe('User', () => {
    afterEach((done) => {
        User.deleteOne({}, (err) => {
            done();
        });
    });

    describe('/POST /user/signup', () => {
        const userIncorrect = { emailsds: "DummyUser",phone:"123123",userType:"customer", password: "dummyUser", confirmPassword: "dummyUser",name:"user" }

        const userWrongConfirmPass = { name: "Dummy",phone:"123",userType:"customer", username: "DummyUser", password: "dummyPass", confirmPassword: "dummyPass123" };

        const userCorrect = { name: "Dummy",phone:"123", email: "DummyUser",userType:"customer", password: "dummyPass", confirmPassword: "dummyPass" };

        // registration of user with missing field Should throw error of missing field
        it('it should say incorrect internal server error because missing field -> signup user', (done) => {
            chai.request(server)
                .post('/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(userIncorrect)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(500);
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Internal Server Error");
                    // res.body.status.should.be.eql(500);
                    done();
                });
        });

        // registration of user with incorrect confirm password Should throw error.
        it('it should say password and confirm password not equal -> signup user', (done) => {
            chai.request(server)
                .post('/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(userWrongConfirmPass)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(422);
                    // res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Password and confirm-password not equal");
                    // res.body.status.should.be.eql(422);
                    done();
                });
        });

        // registration of user with correct credentials Should not throw error.
        it('it should say user signed up -> signup user', (done) => {
            chai.request(server)
                .post('/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(userCorrect)
                .end((err, res) => {
                    // console.log(res.body);
                    res.should.have.status(201);
                    // res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Registration successful");
                    // res.body.status.should.be.eql(200);
                    done();
                });
        });

    });


    // All tests for login route
    describe('/POST /user/login', () => {

        // unable to login because of wrong email
        it('it should say authorization failed because wrong user email -> login user', (done) => {
            User.create({name:"TestUser",phone:"123456", email: "TestUser", password: "TestPass",userType:"customer" },(err,user)=>{
                chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({email:"TestUser2",password:"TestPass"})
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(401);
                    // res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Invalid Email or Password");
                    // res.body.status.should.be.eql(401);
                    done();
                });
            })
            
        });


        // unable to login because of wrong password
        it('it should say authorization failed because wrong user password -> login user', (done) => {
            User.create({name:"TestUser",phone:"123456", email: "TestUser", password: "TestPass",userType:"customer"},(err,user)=>{
                chai.request(server)
                .post('/user/login')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({username:"TestUser",password:"TestPass2"})
                .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(401);
                    // res.body.should.have.property("status");
                    res.body.should.have.property("message");
                    res.body.message.should.be.eql("Invalid Email or Password");
                    // res.body.status.should.be.eql(401);
                    done();
                });
            })
            
        });


        // Should be able to log in with correct credentials
        // it('it should login user and send jwt token -> login user', (done) => {
        //     User.create({name:"TestUser",phone:"123456", email: "TestUser", password: hashedPwd,userType:"customer"},(err,user)=>{
        //         chai.request(server)
        //         .post('/user/login')
        //         .set('content-type', 'application/x-www-form-urlencoded')
        //         .send({username:user.email,password:"TestPass"})
        //         .end((err, res) => {
                    
        //             res.should.have.status(200);
        //             res.body.should.have.property("message");
        //             res.body.message.should.be.eql("Sign in successful, here is your token");
                    
        //             res.body.should.have.property("data");
        //             res.body.data.should.have.property("token");
        //             done();
        //         });
        //     })
            
        // });


    });

});






// Test for listting users



