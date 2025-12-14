export const computeFirstTimeBuyer = (input) => {
  const { homeCount, isFirst, isAdjust, price } = input
  
  const isMultiHome = parseInt(homeCount) >= 2
  const isHighRisk = isMultiHome && isAdjust === '예'
  
  let judgment = ''
  let summary = ''
  
  if (isFirst === '예' && homeCount === '1') {
    judgment = '생애최초 1주택 - 취득세 면제 가능성 높음'
    summary = '생애최초 1주택 구매로 취득세 면제 대상입니다.'
  } else if (isMultiHome) {
    judgment = '다주택 보유 - 중과세 적용 가능성 높음'
    summary = `${homeCount}주택 보유로 중과세가 적용될 수 있습니다.`
  } else {
    judgment = '1주택 보유 - 일반 세율 적용'
    summary = '1주택 보유로 일반 취득세율이 적용됩니다.'
  }
  
  if (isHighRisk) {
    judgment += ' (조정대상지역으로 인한 추가 가중 가능)'
    summary += ' 조정대상지역으로 인해 세율이 가중될 수 있습니다.'
  }
  
  return {
    judgment: judgment,
    summary: summary,
    isMultiHome: isMultiHome,
    isHighRisk: isHighRisk
  }
}



