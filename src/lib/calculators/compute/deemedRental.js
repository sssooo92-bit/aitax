export const computeDeemedRental = (input) => {
  const { deposit, rate = 3.0 } = input
  
  const annual = Math.floor(deposit * rate / 100)
  const monthly = Math.floor(annual / 12)
  
  return {
    monthlyRental: monthly.toLocaleString(),
    annualRental: annual.toLocaleString(),
    rate: rateNum.toFixed(1),
    summary: `보증금 ${deposit.toLocaleString()}원 기준, 연이율 ${rate}% 적용`
  }
}

