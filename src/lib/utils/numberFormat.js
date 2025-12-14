// 숫자 포맷팅 유틸리티

/**
 * 숫자를 원화 형식으로 포맷팅 (50,000,000)
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0'
  }
  
  // 문자열인 경우 쉼표 제거 후 숫자로 변환
  const numValue = typeof value === 'string' 
    ? parseFloat(value.replace(/,/g, '')) || 0
    : value || 0
  
  // 정수로 변환
  const intValue = Math.floor(numValue)
  
  // 천단위 쉼표 추가
  return intValue.toLocaleString('ko-KR')
}

/**
 * 숫자 문자열을 포맷팅된 문자열로 변환
 */
export const formatNumberString = (str) => {
  if (!str) return '0'
  const num = parseFloat(str.replace(/,/g, '')) || 0
  return formatNumber(num)
}



