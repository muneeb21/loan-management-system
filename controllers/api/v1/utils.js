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
  const interestPerMonth= (principle/100)*interestRate;
  const totalInterest= interestPerMonth*monthsToRepay;
  return principle+totalInterest+applicationFee;

}

// module.exports.filterLoan=function(loans,filter){
//     const data=[];
//     for(let i=0;i<loans.length;i++){
//         if(loans[i])
//     }
// }