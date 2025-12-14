// 유틸리티 함수: 숫자 문자열을 숫자로 변환
export const parseNumber = (value) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    return parseFloat(value.replace(/,/g, '')) || 0
  }
  return 0
}

// 유틸리티 함수: 숫자를 원화 형식으로 포맷 (천단위 쉼표) - 50,000,000 형식
export const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0'
  }
  const numValue = typeof value === 'number' ? value : parseNumber(value)
  const intValue = Math.floor(numValue)
  return intValue.toLocaleString('ko-KR')
}

