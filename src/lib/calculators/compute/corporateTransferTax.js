export const computeCorporateTransferTax = (input) => {
  const { gain, corpRate } = input
  
  const rate = typeof corpRate === 'number' ? corpRate : parseFloat(corpRate) || 10
  const tax = Math.floor(gainNum * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    taxRate: rate.toFixed(0),
    summary: `법인 양도세율 ${rate}% 기준으로 계산되었습니다.`
  }
}

