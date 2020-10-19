module.exports.calculateInterest=function(principle){
    if(principle>=10000 && principle<500000){
        return 2;
    }
    if(principle>=50000 && principle<100000){
        return 3;
    }

    if(principle>=10000){
        return 4;
    }
}

module.exports.calculateAmount=function(principle,monthsToRepay,interestRate){
  const applicationFee= 500;
  const interestPerMonth= (principle/100)*interest;
  const totalInterest= interestPerMonth*monthsToRepay;
  return principle+totalInterest+applicationFee;

}