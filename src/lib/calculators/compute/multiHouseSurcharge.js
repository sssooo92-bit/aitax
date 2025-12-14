export const computeMultiHouseSurcharge = (input) => {
  const { homeCount, isAdjust, gain } = input
  
  let add = 0
  if (homeCount === '2') {
    add = 10
  } else if (homeCount === '3+') {
    add = 20
  }
  
  if (isAdjust === '예') {
    add += 5
  }
  
  const rate = 20 + add
  const tax = Math.floor(gainNum * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    surchargeRate: add.toFixed(0),
    totalRate: rate.toFixed(0),
    summary: `${homeCount}주택 ${isAdjust === '예' ? '(조정대상지역)' : ''} 기준 다주택 중과세입니다. 기본 20% + 가산 ${add}%`
  }
}

