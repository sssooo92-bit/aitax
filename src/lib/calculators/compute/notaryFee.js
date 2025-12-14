import { parseNumber } from '../utils'

export const computeNotaryFee = (input) => {
  const { price, count = 1 } = input
  const priceNum = parseNumber(price)
  const countNum = typeof count === 'number' ? count : parseNumber(count) || 1
  
  const base = 150000
  const variable = Math.floor(priceNum * 0.001) // 0.1%
  const total = (base + variable) * countNum
  
  return {
    notaryFee: total.toLocaleString(),
    baseFee: base.toLocaleString(),
    variableFee: variable.toLocaleString(),
    summary: `기본비용 ${base.toLocaleString()}원 + 변동비용 ${variable.toLocaleString()}원 × ${count}건 = 총 ${total.toLocaleString()}원`
  }
}

