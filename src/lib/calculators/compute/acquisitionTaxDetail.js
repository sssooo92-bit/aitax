import { parseNumber } from '../utils'

export const computeAcquisitionTaxDetail = (input) => {
  const { acquireType, price, homeCount, area, isAdjust, isFirst } = input
  const priceNum = parseNumber(price)
  
  let baseRate = 0
  
  if (acquireType === '주택') {
    baseRate = 1.1
  } else if (acquireType === '오피스텔') {
    baseRate = 4.6
  } else {
    baseRate = 4.6
  }
  
  // 면적 할인
  if (area === '60㎡이하') {
    baseRate -= 0.1
  } else if (area === '85㎡이하') {
    baseRate -= 0.05
  }
  
  let add = 0
  if (homeCount === '2') {
    add = 0.8
  } else if (homeCount === '3+') {
    add = 1.2
  }
  
  if (isAdjust === '예') {
    add += 0.2
  }
  
  if (isFirst === '예') {
    baseRate = baseRate * 0.7
  }
  
  const rate = Math.max(0, baseRate + add)
  const tax = Math.floor(priceNum * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    taxRate: rate.toFixed(2),
    summary: `${acquireType} ${homeCount}주택 ${area ? `(${area})` : ''} ${isAdjust === '예' ? '(조정대상지역)' : ''} ${isFirst === '예' ? '(생애최초 할인)' : ''} 기준으로 계산되었습니다.`
  }
}

