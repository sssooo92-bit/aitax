export const computeDepositInsurance = (input) => {
  const { deposit, rent, convertRate = 4.0 } = input
  
  const rentEquivalent = Math.floor((deposit * convertRate / 100) / 12)
  const totalMonthly = rent + rentEquivalent
  
  return {
    rentEquivalent: rentEquivalent.toLocaleString(),
    totalMonthly: totalMonthly.toLocaleString(),
    convertRate: convertRateNum.toFixed(1),
    summary: `보증금 월세환산액 ${rentEquivalent.toLocaleString()}원 + 월세 ${rent.toLocaleString()}원 = 총 월비용 ${totalMonthly.toLocaleString()}원`
  }
}

