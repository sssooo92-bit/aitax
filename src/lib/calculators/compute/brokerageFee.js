import { formatCurrency } from '../utils'

export const computeBrokerageFee = (input) => {
  const { dealType, amount, customRate } = input
  const amountNum = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) || 0 : amount || 0
  const rateNum = customRate ? (typeof customRate === 'string' ? parseFloat(customRate.replace(/,/g, '')) || 0 : customRate) : null
  
  let feeRate = rateNum || 0.4
  let totalFee = 0
  
  if (dealType === '매매') {
    // 구간별 누진 계산
    if (amountNum <= 50000000) {
      totalFee = Math.floor(amountNum * 0.006)
      feeRate = 0.6
    } else if (amountNum <= 200000000) {
      totalFee = Math.floor(50000000 * 0.006) + Math.floor((amountNum - 50000000) * 0.005)
      feeRate = 0.5
    } else if (amountNum <= 900000000) {
      totalFee = Math.floor(50000000 * 0.006) + Math.floor(150000000 * 0.005) + Math.floor((amountNum - 200000000) * 0.004)
      feeRate = 0.4
    } else {
      totalFee = Math.floor(50000000 * 0.006) + Math.floor(150000000 * 0.005) + Math.floor(700000000 * 0.004) + Math.floor((amountNum - 900000000) * 0.009)
      feeRate = 0.9
    }
  } else if (dealType === '전세') {
    feeRate = 0.2
    totalFee = Math.floor(amountNum * feeRate / 100)
  } else if (dealType === '월세') {
    feeRate = 0.05
    totalFee = Math.floor(amountNum * feeRate / 100)
  }
  
  return {
    brokerageFee: formatCurrency(totalFee),
    feeRate: feeRate.toFixed(2),
    summary: `${dealType} 기준 중개수수료입니다. ${dealType === '매매' ? '(구간별 누진 적용)' : ''}`
  }
}

