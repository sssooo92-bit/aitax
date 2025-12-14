import { parseNumber } from '../utils'

export const computeCapitalGainsTax = (input) => {
  const { buyPrice, sellPrice, buyDate, sellDate, expense = 0 } = input
  
  const buyPriceNum = parseNumber(buyPrice)
  const sellPriceNum = parseNumber(sellPrice)
  const expenseNum = parseNumber(expense)
  const gain = sellPriceNum - buyPriceNum - expenseNum
  
  if (gain <= 0) {
    return {
      expectedTax: '0',
      capitalGain: gain.toLocaleString(),
      taxRate: '0',
      summary: '양도차익이 없어 세금이 발생하지 않습니다.'
    }
  }
  
  // 보유기간 계산
  const buy = new Date(buyDate)
  const sell = new Date(sellDate)
  const holdingDays = Math.floor((sell - buy) / (1000 * 60 * 60 * 24))
  const holdingYears = holdingDays / 365
  
  // 세율 적용
  let rate = 0
  if (holdingYears < 1) {
    rate = 40
  } else if (holdingYears < 2) {
    rate = 30
  } else {
    rate = 20
  }
  
  const tax = Math.floor(gain * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    capitalGain: gain.toLocaleString(),
    taxRate: rate.toFixed(0),
    holdingYears: holdingYears.toFixed(1),
    summary: `보유기간 ${holdingYears.toFixed(1)}년, 양도차익 ${gain.toLocaleString()}원 기준으로 계산되었습니다.`
  }
}

