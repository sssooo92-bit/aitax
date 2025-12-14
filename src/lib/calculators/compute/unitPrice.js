export const computeUnitPrice = (input) => {
  const { total, area, unit } = input
  
  const unitPrice = Math.floor(total / area)
  
  return {
    unitPrice: unitPrice.toLocaleString(),
    total: total.toLocaleString(),
    area: areaNum,
    unit: unit,
    summary: `총가격 ${total.toLocaleString()}원 ÷ 면적 ${area}${unit === '평당' ? '평' : 'm²'} = ${unitPrice.toLocaleString()}원/${unit === '평당' ? '평' : 'm²'}`
  }
}

