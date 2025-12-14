export const computeLoanCalculation = (input) => {
  const { loanAmount, annualRate, years, payType } = input
  
  const monthlyRate = annualRate / 100 / 12
  const totalMonths = years * 12
  
  let monthlyPayment = 0
  let totalInterest = 0
  
  if (payType === '만기일시') {
    monthlyPayment = Math.floor(loanAmountNum * monthlyRate)
    totalInterest = monthlyPayment * totalMonths
  } else {
    // 원리금균등 (간단 계산)
    const principalPerMonth = Math.floor(loanAmountNum / totalMonths)
    const interestPerMonth = Math.floor(loanAmountNum * monthlyRate)
    monthlyPayment = principalPerMonth + interestPerMonth
    totalInterest = interestPerMonth * totalMonths
  }
  
  return {
    monthlyPayment: monthlyPayment.toLocaleString(),
    totalInterest: totalInterest.toLocaleString(),
    totalAmount: (loanAmountNum + totalInterest).toLocaleString(),
    summary: `${payType} 방식, 월 ${monthlyPayment.toLocaleString()}원 상환, 총 이자 ${totalInterest.toLocaleString()}원`
  }
}

