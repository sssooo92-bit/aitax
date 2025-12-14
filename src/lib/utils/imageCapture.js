/**
 * 결과 카드 이미지 캡처 유틸리티
 * html2canvas 사용
 */

/**
 * 결과 카드를 PNG 이미지로 변환
 * @param {string} elementId - 캡처할 요소의 ID
 * @returns {Promise<Blob>} PNG Blob
 */
export const captureResultCard = async (elementId = 'result-card') => {
  // html2canvas 동적 import (설치 필요)
  try {
    const html2canvas = (await import('html2canvas')).default
    
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('결과 카드를 찾을 수 없습니다.')
    }

    const canvas = await html2canvas(element, {
      backgroundColor: '#151A21',
      scale: 2, // 고해상도
      logging: false,
      useCORS: true,
      allowTaint: false
    })

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('이미지 변환에 실패했습니다.'))
        }
      }, 'image/png', 1.0)
    })
  } catch (error) {
    if (error.message.includes('Cannot find module')) {
      throw new Error('html2canvas가 설치되지 않았습니다. npm install html2canvas를 실행해주세요.')
    }
    throw error
  }
}

/**
 * Blob을 다운로드
 * @param {Blob} blob - 다운로드할 Blob
 * @param {string} filename - 파일명
 */
export const downloadBlob = (blob, filename = 'result.png') => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Web Share API로 이미지 공유
 * @param {Blob} blob - 공유할 이미지 Blob
 * @param {string} title - 공유 제목
 */
export const shareImage = async (blob, title = 'AI부동산계산 결과') => {
  if (!navigator.share) {
    throw new Error('이 브라우저는 이미지 공유를 지원하지 않습니다.')
  }

  const file = new File([blob], 'result.png', { type: 'image/png' })
  
  try {
    await navigator.share({
      title: title,
      files: [file]
    })
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, cancelled: true }
    }
    throw error
  }
}

