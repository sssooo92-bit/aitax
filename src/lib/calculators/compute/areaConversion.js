export const computeAreaConversion = (input) => {
  const { value, direction } = input
  
  const PYEONG_TO_SQM = 3.3058
  let result = 0
  
  if (direction === '평→m²') {
    result = value * PYEONG_TO_SQM
  } else {
    result = value / PYEONG_TO_SQM
  }
  
  return {
    convertedValue: result.toFixed(2),
    originalValue: valueNum,
    direction: direction,
    summary: `${value}${direction === '평→m²' ? '평' : 'm²'} = ${result.toFixed(2)}${direction === '평→m²' ? 'm²' : '평'}`
  }
}

