export const computeLocalResourceTax = (input) => {
  const { officialPrice } = input
  
  const taxRate = 0.02 // 0.02%
  const tax = Math.floor(officialPrice * taxRate / 100)
  
  return {
    taxAmount: tax.toLocaleString(),
    taxRate: '0.02',
    summary: '지역자원시설세 기준으로 계산되었습니다.'
  }
}



