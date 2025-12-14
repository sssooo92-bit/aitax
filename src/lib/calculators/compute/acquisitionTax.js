import { parseNumber } from '../utils'

export const computeAcquisitionTax = (input) => {
  const { acquireType, price, homeCount, isAdjust, isFirst } = input
  const priceNum = parseNumber(price)
  
  let baseRate = 0
  
  // 기본 세율
  if (acquireType === '주택') {
    baseRate = 1.1
  } else if (acquireType === '오피스텔') {
    baseRate = 4.6
  } else {
    baseRate = 4.6 // 토지
  }
  
  // 가산
  let add = 0
  if (homeCount === '2') {
    add = 0.8
  } else if (homeCount === '3+') {
    add = 1.2
  }
  
  // 조정대상지역 가산
  if (isAdjust === '예') {
    add += 0.2
  }
  
  // 생애최초 할인
  if (isFirst === '예') {
    baseRate = baseRate * 0.7
  }
  
  const rate = Math.max(0, baseRate + add)
  const tax = Math.floor(priceNum * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    taxRate: rate.toFixed(2),
    summary: `${acquireType} ${homeCount}주택 ${isAdjust === '예' ? '(조정대상지역)' : ''} ${isFirst === '예' ? '(생애최초 할인 적용)' : ''} 기준으로 계산되었습니다.`
  }
}

