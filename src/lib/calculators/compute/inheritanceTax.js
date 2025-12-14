export const computeInheritanceTax = (input) => {
  const { totalValue, heirs, hasSpouse } = input
  
  const basicDeduction = 200000000
  const personalDeduction = heirsNum * 50000000
  const spouseDeduction = hasSpouse === '예' ? 300000000 : 0
  
  const totalDeduction = basicDeduction + personalDeduction + spouseDeduction
  const base = Math.max(0, totalValueNum - totalDeduction)
  const rate = 20
  const tax = Math.floor(base * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    totalDeduction: totalDeduction.toLocaleString(),
    taxableBase: base.toLocaleString(),
    taxRate: '20',
    summary: `상속인 ${heirs}명 ${hasSpouse === '예' ? '(배우자 포함)' : ''} 기준, 총 공제액 ${totalDeduction.toLocaleString()}원 적용 후 과세대상액 ${base.toLocaleString()}원입니다.`
  }
}

