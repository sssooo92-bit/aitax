export const computeDTIDSR = (input) => {
  const { annualIncome, annualDebtPay, housePrice, loanAmount, annualRentIncome } = input
  
  const DSR = (annualDebtPay / annualIncome) * 100
  const LTV = (loanAmount / housePrice) * 100
  const RTI = annualRentIncome ? (annualRentIncome / annualDebtPay) * 100 : null
  
  return {
    DSR: DSR.toFixed(2),
    LTV: LTV.toFixed(2),
    RTI: RTI ? RTI.toFixed(2) : null,
    summary: `DSR ${DSR.toFixed(2)}%, LTV ${LTV.toFixed(2)}%${RTI ? `, RTI ${RTI.toFixed(2)}%` : ' (RTI 계산 불가)'}`
  }
}



