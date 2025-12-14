// 공유 기능 유틸리티

/**
 * 계산 결과를 공유용 텍스트로 포맷팅
 */
export const formatShareText = (result, category) => {
  let text = '[AI부동산계산]\n'
  text += `${category}\n\n`
  
  // 핵심 결과 숫자 위주로 추가
  const keyFields = []
  
  if (result.expectedTax) {
    keyFields.push(`- 예상 세금: ${result.expectedTax}원`)
  }
  if (result.brokerageFee) {
    keyFields.push(`- 중개수수료: ${result.brokerageFee}원`)
  }
  if (result.propertyTax) {
    keyFields.push(`- 재산세: ${result.propertyTax}원`)
  }
  if (result.comprehensiveTax && result.comprehensiveTax !== '0') {
    keyFields.push(`- 종부세: ${result.comprehensiveTax}원`)
  }
  if (result.taxAmount) {
    keyFields.push(`- 예상세액: ${result.taxAmount}원`)
  }
  if (result.annualRent) {
    keyFields.push(`- 연 임대수익: ${result.annualRent}원`)
  }
  if (result.yieldPercent) {
    keyFields.push(`- 수익률: ${result.yieldPercent}%`)
  }
  if (result.monthlyPayment) {
    keyFields.push(`- 월 예상납입: ${result.monthlyPayment}원`)
  }
  if (result.DSR) {
    keyFields.push(`- DSR: ${result.DSR}%`)
  }
  if (result.LTV) {
    keyFields.push(`- LTV: ${result.LTV}%`)
  }
  if (result.optimalPrice) {
    keyFields.push(`- 적정매수가: ${result.optimalPrice}원`)
  }
  if (result.convertedValue) {
    keyFields.push(`- 환산값: ${result.convertedValue}${result.direction === '평→m²' ? 'm²' : '평'}`)
  }
  if (result.unitPrice) {
    keyFields.push(`- 단위가격: ${result.unitPrice}원/${result.unit === '평당' ? '평' : 'm²'}`)
  }
  if (result.coverage && result.far) {
    keyFields.push(`- 건폐율: ${result.coverage}%, 용적률: ${result.far}%`)
  }
  if (result.interest) {
    keyFields.push(`- 연체이자: ${result.interest}원`)
  }
  if (result.totalCost) {
    keyFields.push(`- 예상명도비용: ${result.totalCost}원`)
  }
  if (result.reduction) {
    keyFields.push(`- 임대료 인하액: ${result.reduction}원`)
  }
  if (result.notaryFee) {
    keyFields.push(`- 등기비용: ${result.notaryFee}원`)
  }
  if (result.monthlyRental) {
    keyFields.push(`- 월 간주임대료: ${result.monthlyRental}원`)
  }
  if (result.spouseShare && result.otherShare) {
    keyFields.push(`- 배우자 지분: ${result.spouseShare}%, 기타: ${result.otherShare}%`)
  }
  
  // 세율 정보 추가
  if (result.taxRate) {
    keyFields.push(`- 적용 세율: ${result.taxRate}%`)
  }
  if (result.feeRate) {
    keyFields.push(`- 수수료율: ${result.feeRate}%`)
  }
  
  // 최대 3개까지만 표시
  const displayFields = keyFields.slice(0, 3)
  text += displayFields.join('\n')
  
  // 요약 문장 추가
  if (result.summary) {
    text += `\n\n${result.summary}`
  }
  
  // 면책 문구
  text += '\n\n※ 본 결과는 참고용 계산입니다.'
  
  return text
}

/**
 * Web Share API를 사용하여 공유
 */
const shareViaWebAPI = async (text, title) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title || 'AI부동산계산 결과',
        text: text,
        url: window.location.href
      })
      return { success: true, method: 'web-share' }
    } catch (error) {
      // 사용자가 공유를 취소한 경우
      if (error.name === 'AbortError') {
        return { success: false, cancelled: true }
      }
      throw error
    }
  }
  return null
}

/**
 * 클립보드에 텍스트 복사
 */
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return { success: true, method: 'clipboard' }
    } else {
      // Fallback: 구식 방법
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        if (successful) {
          return { success: true, method: 'clipboard-fallback' }
        }
        return { success: false }
      } catch (err) {
        document.body.removeChild(textArea)
        return { success: false }
      }
    }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * 계산 결과 공유하기
 */
export const shareResult = async (result, category) => {
  try {
    const shareText = formatShareText(result, category)
    const title = `${category} - AI부동산계산`
    
    // 1. Web Share API 시도
    const webShareResult = await shareViaWebAPI(shareText, title)
    if (webShareResult) {
      if (webShareResult.cancelled) {
        return { success: false, cancelled: true }
      }
      if (webShareResult.success) {
        return { success: true, method: 'web-share', message: '공유되었습니다.' }
      }
    }
    
    // 2. 클립보드 복사로 Fallback
    const clipboardResult = await copyToClipboard(shareText)
    if (clipboardResult.success) {
      return { success: true, method: 'clipboard', message: '클립보드에 복사되었습니다.' }
    }
    
    return { success: false, message: '공유에 실패했습니다.' }
  } catch (error) {
    console.error('Share error:', error)
    // 조용히 fallback 처리
    try {
      const clipboardResult = await copyToClipboard(formatShareText(result, category))
      if (clipboardResult.success) {
        return { success: true, method: 'clipboard', message: '클립보드에 복사되었습니다.' }
      }
    } catch (fallbackError) {
      console.error('Fallback share error:', fallbackError)
    }
    return { success: false, message: '공유에 실패했습니다.' }
  }
}



