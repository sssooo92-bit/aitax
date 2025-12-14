export const computeRentalYield = (input) => {
  const { deposit, rent, price, vacancy = 0 } = input
  
  const annualRent = Math.floor(rentNum * 12 * (1 - vacancyNum / 100))
  const yieldPercent = (annualRent / priceNum) * 100
  
  return {
    annualRent: annualRent.toLocaleString(),
    yieldPercent: yieldPercent.toFixed(2),
    summary: `연 임대수익 ${annualRent.toLocaleString()}원, 수익률 ${yieldPercent.toFixed(2)}%입니다.`
  }
}

