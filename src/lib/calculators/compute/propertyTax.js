export const computePropertyTax = (input) => {
  const { officialPrice, isOneHome } = input
  
  // 과표 계산 (공시가격의 60%)
  const taxableBase = Math.floor(officialPriceNum * 0.6)
  const taxRate = 0.15 // 0.15%
  const tax = Math.floor(taxableBase * taxRate / 100)
  
  return {
    propertyTax: tax.toLocaleString(),
    taxableBase: taxableBase.toLocaleString(),
    taxRate: '0.15',
    summary: `${isOneHome === '예' ? '1세대 1주택' : '다주택'} 기준 재산세입니다. 과표: ${taxableBase.toLocaleString()}원`
  }
}

