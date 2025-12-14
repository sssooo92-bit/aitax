export const computeOptimalPrice = (input) => {
  const { targetYield, rent } = input
  
  const annual = rent * 12
  const fairPrice = Math.floor(annual / (targetYield / 100))
  
  return {
    optimalPrice: fairPrice.toLocaleString(),
    targetYield: targetYieldNum.toFixed(1),
    annualRent: annual.toLocaleString(),
    summary: `목표수익률 ${targetYield}% 기준, 적정매수가는 ${fairPrice.toLocaleString()}원입니다.`
  }
}

