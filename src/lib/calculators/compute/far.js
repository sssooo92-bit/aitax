export const computeFAR = (input) => {
  const { landArea, buildingArea, totalFloorArea } = input
  
  const coverage = (buildingArea / landArea) * 100
  const far = (totalFloorArea / landArea) * 100
  
  return {
    coverage: coverage.toFixed(2),
    far: far.toFixed(2),
    summary: `건폐율 ${coverage.toFixed(2)}%, 용적률 ${far.toFixed(2)}%입니다.`
  }
}



