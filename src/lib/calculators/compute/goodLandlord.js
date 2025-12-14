export const computeGoodLandlord = (input) => {
  const { rentBefore, rentAfter, months } = input
  
  const reduction = (rentBefore - rentAfter) * months
  const isEligible = reduction > 0
  
  return {
    reduction: reduction.toLocaleString(),
    judgment: isEligible ? '감면 가능성 있음 (확인 필요)' : '감면 대상 아님',
    summary: `임대료 인하액 ${reduction.toLocaleString()}원, ${isEligible ? '착한임대인 혜택 감면 가능성을 확인하세요.' : '임대료 인하가 없어 감면 대상이 아닙니다.'}`
  }
}



