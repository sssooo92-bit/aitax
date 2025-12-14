export const computeOneHouseExemption = (input) => {
  const { isOneHome, holdYears, liveYears, sellPrice } = input
  
  const isEligible = isOneHome === '예' && holdYears >= 2 && liveYears >= 2
  
  let judgment = ''
  let checks = []
  
  if (isEligible) {
    judgment = '1주택 비과세 가능성 높음'
    checks = [
      '✓ 1주택 보유 조건 충족',
      '✓ 보유기간 2년 이상 충족',
      '✓ 거주기간 2년 이상 충족'
    ]
  } else {
    judgment = '1주택 비과세 요건 미충족 가능'
    if (isOneHome !== '예') {
      checks.push('✗ 1주택 보유 조건 미충족')
    }
    if (holdYearsNum < 2) {
      checks.push(`✗ 보유기간 부족 (현재 ${holdYearsNum}년, 필요 2년 이상)`)
    }
    if (liveYearsNum < 2) {
      checks.push(`✗ 거주기간 부족 (현재 ${liveYearsNum}년, 필요 2년 이상)`)
    }
  }
  
  return {
    judgment: judgment,
    checks: checks,
    summary: `1주택 비과세 판정: ${judgment}`
  }
}

