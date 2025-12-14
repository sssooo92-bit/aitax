import { parseNumber } from '../utils'

export const computeStampTax = (input) => {
  const { item, amount } = input
  const amountNum = parseNumber(amount)
  
  let tax = 0
  
  if (item === '인지세') {
    tax = Math.max(10000, Math.floor(amountNum * 0.0001)) // 0.01% + 기본 1만원
  } else if (item === '국민주택채권') {
    tax = Math.floor(amountNum * 0.005) // 0.5%
  } else if (item === '부가세(간이)') {
    tax = Math.floor(amountNum * 0.1) // 10%
  }
  
  return {
    taxAmount: tax.toLocaleString(),
    taxRate: item === '인지세' ? '0.01%' : item === '국민주택채권' ? '0.5%' : '10%',
    summary: `${item} 기준으로 계산되었습니다.`
  }
}

