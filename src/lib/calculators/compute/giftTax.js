export const computeGiftTax = (input) => {
  const { relation, value, hasHistory } = input
  
  let deduction = 0
  if (relation === '배우자') {
    deduction = 600000000
  } else if (relation === '부모-자녀') {
    deduction = 50000000
  } else {
    deduction = 10000000
  }
  
  // 10년내 증여이력이 있으면 공제 50%만 적용
  if (hasHistory === '예') {
    deduction = Math.floor(deduction * 0.5)
  }
  
  const base = Math.max(0, valueNum - deduction)
  const rate = 10
  const tax = Math.floor(base * rate / 100)
  
  return {
    expectedTax: tax.toLocaleString(),
    deduction: deduction.toLocaleString(),
    taxableBase: base.toLocaleString(),
    taxRate: '10',
    summary: `${relation} 관계, 공제액 ${deduction.toLocaleString()}원 적용 후 과세대상액 ${base.toLocaleString()}원입니다.`
  }
}

