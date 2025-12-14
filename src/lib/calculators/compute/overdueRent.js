export const computeOverdueRent = (input) => {
  const { unpaid, days, annualRate = 12 } = input
  
  const interest = Math.floor(unpaid * (annualRate / 100) * (days / 365))
  const total = unpaid + interest
  
  return {
    interest: interest.toLocaleString(),
    total: total.toLocaleString(),
    annualRate: annualRateNum.toFixed(1),
    summary: `연체이자 ${interest.toLocaleString()}원, 합계 ${total.toLocaleString()}원입니다.`
  }
}

