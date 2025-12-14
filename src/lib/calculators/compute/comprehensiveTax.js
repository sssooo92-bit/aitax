import { parseNumber } from '../utils'

export const computeComprehensiveTax = (input) => {
  const { officialPrice, homeCount, isOneHome } = input
  const officialPriceNum = parseNumber(officialPrice)
  
  // 공제액
  const deduction = isOneHome === '예' ? 110000000 : 60000000
  const base = Math.max(0, officialPriceNum - deduction)
  
  // 세율
  let rate = 0
  if (homeCount === '1') {
    rate = 0.5
  } else if (homeCount === '2') {
    rate = 0.8
  } else {
    rate = 1.2
  }
  
  const tax = Math.floor(base * rate / 100)
  
  return {
    comprehensiveTax: tax.toLocaleString(),
    deduction: deduction.toLocaleString(),
    taxRate: rate.toFixed(1),
    threshold: (officialPrice - deduction).toLocaleString(),
    summary: `${homeCount}주택 ${isOneHome === '예' ? '(1세대 1주택)' : '(다주택)'} 기준 종합부동산세입니다. 공제액: ${deduction.toLocaleString()}원`
  }
}

