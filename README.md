# Loan Management API
An API which facilitates the working of a minimal loan management system

**Theme of the API**
- There are three types of users:- Customer, Agent, Admin<br/>
- Customer is the client who makes a request for the loan<br/>
- Agent is the middleman associated with the bank who has certain authourities such as edit loans,<br/>
  listing users, and making loan request on behalf of customer<br/>
- Before accessing to these functions an agent has to get the approval by the admin of being an agent<br/>
- Admin is the highest authority who can approve or reject a loan and also the request by agent<br/>
- Customers and agents can Sign up<br/>
- Admin, cutomers and agents can login(agent can login only if agent is approved by the admin)<br/>
- When an agent will signup a request will be sent to the admin for approvalxxxxxx<br/>
- A loan has entities such as principle, interest rate, months to repay, emi and status<br/>
- The value of interest rate would depend on the value of principlexxxxxxxxx<br/>
- The loan can have 3 kinds of status: Approved, New or Rejected

**Tech stack used**<br/>
  Nodejs, Express framework, Mongodb

**Key modules used**<br>
  Passport-jwt, Jsonwebtoken, Bcryptjs, Mocha, Chai   

**Model Schemas**
> User<br/>
  Has details about the user such as name, email, password, user type and if user is approved or not<br/>
 >Loan<br/> 
  Has details of principle, interest rate, months to repay, emi, status and history of edited loans

**Explaination of key features**

- Only customers and agents can signup<br/>
- Customer will be created in the database on signup<br>
- When agent would signup a request would to the the admin to approve the agent.
- Admin and customer are by default approved but not agent<br>
- Agent can only login after being approved<br>
- An instance of admin is created initially in the database(see the main index file, uncomment the mentioned code, run "npm start", comment the same code again and run "npm start",later the admin can change password if want to)<br>
- All the users can update their passwords and its length should be greater than 6<br>
- Passwords are encrypted before being stored<br>
- Agents can list all customers and admin can list all users<br>
- The interest on a loan would depend on the principle<br/>
  For range (10000,50000) interest = 3%<br/> 
  For range (50000,100000) interest = 4% <br/>
  Greater than 100000 interest = 5%<br/>
- Loan can be approved or rejected by admin only<br/>
- Only agent can edit a loan if it is still not approved<br/>
- Previous instance of the same loan is pushed inside the history before being edited<br>
- Loans can be listed according to filter


**Routes**

> /users/signup<br />
> /users/login<br />
> /users/listUsers<br />
> /users/agentRequestList<br />
> /users//approveAgent<br />
> /users/updatePassword<br />
> /users/loan/newLoan<br />
> /users/loan/approveLoan<br />
> /users/loan/rejectLoan<br />
> /users/loan/editLoan<br />
> /users/loan/allLoans<br />
> /users/loan/loansbyFilter<br />


**Set up Project using Docker files**

- Dockerfile.production (This is for main project)<br/>
- Dockerfile.test (This is for running testcases)<br/>
- Create an image for each by command => "docker build -t  {your username}/{name of app} {dockerfile name} ."<br/>
- Run the image with command => "docker run -p 49160:8000 -d {your username}/{name of app}"

**If can't set it up on docker**
> Run "npm init", setup the project install the dependencies and run "npm start"
<br>

**Run unit tests on Node**
- Install the dev dependencies: mocha, chai and chai http<br/>
- Navigate to project directory and run => "npm test"

![alt text](https://github.com/muneeb21/loan-management-system/blob/master/screenshots/ss1.png?raw=true)

<br>
<br/>

# Working of API on postman (examples)

<br/>

> Signup<br/>
![alt text](https://github.com/muneeb21/loan-management-system/blob/master/screenshots/ss2.png?raw=true)<br/>

![alt text](https://github.com/muneeb21/loan-management-system/blob/master/screenshots/ss3.png?raw=true)<br/>


>Agent Signup<br/>

![alt text](https://github.com/muneeb21/loan-management-system/blob/master/screenshots/ss4.png?raw=true)<br/>


>Loan Request<br>
![alt text](https://github.com/muneeb21/loan-management-system/blob/master/screenshots/ss5.png?raw=true)<br/>

![alt text](https://github.com/muneeb21/loan-management-system/blob/master/screenshots/ss6.png?raw=true)
