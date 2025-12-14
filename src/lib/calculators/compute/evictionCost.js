export const computeEvictionCost = (input) => {
  const { base, months, monthlyPenalty } = input
  
  const penalty = months * monthlyPenalty
  const total = base + penalty
  
  return {
    totalCost: total.toLocaleString(),
    baseCost: base.toLocaleString(),
    penaltyCost: penalty.toLocaleString(),
    summary: `기본비용 ${base.toLocaleString()}원 + 지연비용 ${penalty.toLocaleString()}원 = 총 ${total.toLocaleString()}원`
  }
}



