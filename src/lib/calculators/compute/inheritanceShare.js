export const computeInheritanceShare = (input) => {
  const { heirs, spouseIncluded } = input
  
  let spouseShare = 0
  let otherShare = 0
  
  if (spouseIncluded === '예') {
    // 배우자 1.5배 가중치
    const totalWeight = 1.5 + (heirsNum - 1) * 1
    spouseShare = (1.5 / totalWeight) * 100
    otherShare = (1 / totalWeight) * 100
  } else {
    // 모두 균등
    const share = 100 / heirsNum
    spouseShare = 0
    otherShare = share
  }
  
  return {
    spouseShare: spouseIncluded === '예' ? spouseShare.toFixed(2) : '0',
    otherShare: otherShare.toFixed(2),
    summary: spouseIncluded === '예' 
      ? `배우자 지분 ${spouseShare.toFixed(2)}%, 기타 상속인 각 ${otherShare.toFixed(2)}%`
      : `상속인 ${heirs}명 균등분할, 각 ${otherShare.toFixed(2)}%`
  }
}

