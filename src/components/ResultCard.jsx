import React, { useState } from 'react'
import html2canvas from 'html2canvas'
import { getCalculatorDefinition } from '../lib/calculators/definitions'
import './ResultCard.css'

// 이미지 캡처 함수
const captureResultCard = async (elementId) => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('결과 카드를 찾을 수 없습니다.')
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#151A21',
    scale: 2,
    logging: false
  })

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('이미지 변환 실패')), 'image/png', 1.0)
  })
}

const downloadBlob = (blob, filename = 'result.png') => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const shareImage = async (blob, title = 'AI부동산계산 결과') => {
  if (!navigator.share) throw new Error('이 브라우저는 이미지 공유를 지원하지 않습니다.')
  const file = new File([blob], 'result.png', { type: 'image/png' })
  try {
    await navigator.share({ title, files: [file] })
    return { success: true }
  } catch (error) {
    if (error.name === 'AbortError') return { success: false, cancelled: true }
    throw error
  }
}

const ResultCard = ({ result, category }) => {
  const [isSharing, setIsSharing] = useState(false)
  const [shareMessage, setShareMessage] = useState(null)
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  if (!result) return null

  // 주요 결과값 찾기 (가장 큰 숫자)
  const getMainResult = () => {
    if (result.brokerageFee) return { label: '중개수수료', value: result.brokerageFee, unit: '원' }
    if (result.expectedTax) return { label: '예상 세금', value: result.expectedTax, unit: '원' }
    if (result.taxAmount) return { label: '세액', value: result.taxAmount, unit: '원' }
    if (result.comprehensiveTax) return { label: '종부세', value: result.comprehensiveTax, unit: '원' }
    if (result.propertyTax) return { label: '재산세', value: result.propertyTax, unit: '원' }
    return null
  }

  const mainResult = getMainResult()

  const handleShareLink = async () => {
    if (navigator.clipboard) {
      try {
        const shareUrl = result.share?.shareUrl || window.location.href
        await navigator.clipboard.writeText(shareUrl)
        setShareMessage('링크가 복사되었습니다.')
        setTimeout(() => setShareMessage(null), 2000)
      } catch (error) {
        setShareMessage('링크 복사에 실패했습니다.')
        setTimeout(() => setShareMessage(null), 2000)
      }
    }
  }

  const handleSaveImage = async () => {
    setIsSharing(true)
    setShareMessage(null)
    
    try {
      const blob = await captureResultCard('result-card')
      const filename = `AI부동산계산_${category || '결과'}_${new Date().toISOString().split('T')[0]}.png`
      downloadBlob(blob, filename)
      setShareMessage('이미지가 저장되었습니다.')
      setTimeout(() => setShareMessage(null), 2000)
    } catch (error) {
      console.error('이미지 저장 실패:', error)
      setShareMessage(error.message || '이미지 저장에 실패했습니다.')
      setTimeout(() => setShareMessage(null), 3000)
    } finally {
      setIsSharing(false)
    }
  }

  const handleShareImage = async () => {
    setIsSharing(true)
    setShareMessage(null)
    
    try {
      const blob = await captureResultCard('result-card')
      const shareResult = await shareImage(blob, `AI부동산계산 - ${category || '결과'}`)
      
      if (shareResult.success) {
        setShareMessage('이미지가 공유되었습니다.')
        setTimeout(() => setShareMessage(null), 2000)
      } else if (shareResult.cancelled) {
        // 사용자가 취소한 경우 메시지 표시 안 함
      }
    } catch (error) {
      // Web Share API 미지원 시 다운로드로 대체
      if (error.message.includes('지원하지 않습니다')) {
        handleSaveImage()
        return
      }
      console.error('이미지 공유 실패:', error)
      setShareMessage(error.message || '이미지 공유에 실패했습니다.')
      setTimeout(() => setShareMessage(null), 3000)
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="result-card" id="result-card">
      <div className="result-title">
        {category || '계산 결과'}
      </div>
      
      <div className="result-content">
        {/* 주요 결과 (큰 숫자) */}
        {mainResult && (
          <div className="result-summary-main">
            <div className="result-summary-label">{mainResult.label}</div>
            <div className="result-summary-value">
              {mainResult.value}
              <span className="result-summary-unit">{mainResult.unit}</span>
            </div>
          </div>
        )}

        {/* 결과 항목들 */}
        {result.brokerageFee && (
          <div className="result-item">
            <div className="result-label">중개수수료</div>
            <div className="result-value">{result.brokerageFee}원</div>
          </div>
        )}

        {result.feeRate && (
          <div className="result-item">
            <div className="result-label">적용 요율</div>
            <div className="result-value">{result.feeRate}%</div>
          </div>
        )}

        {result.taxRate && (
          <div className="result-item">
            <div className="result-label">적용 세율</div>
            <div className="result-value">{result.taxRate}%</div>
          </div>
        )}

        {result.expectedTax && !mainResult && (
          <div className="result-item">
            <div className="result-label">예상 세금</div>
            <div className="result-value">{result.expectedTax}원</div>
          </div>
        )}

        {/* 상세 산식 (아코디언) */}
        {result.breakdown && result.breakdown.length > 0 && (
          <div className="result-breakdown">
            <div 
              className="breakdown-title"
              onClick={() => setBreakdownOpen(!breakdownOpen)}
            >
              <span>상세 산식</span>
              <span>{breakdownOpen ? '▼' : '▶'}</span>
            </div>
            {breakdownOpen && (
              <div className="breakdown-content">
                {result.breakdown.map((step, index) => (
                  <div key={index} className="breakdown-step">
                    <span className="breakdown-step-number">{step.step}.</span>
                    <strong>{step.name}</strong>: {step.formula} = {step.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 법적 근거 */}
        {result.legalBasis && result.legalBasis.length > 0 && (
          <div className="result-legal-basis">
            <div className="legal-basis-title">계산 근거</div>
            {result.legalBasis.map((basis, index) => (
              <div key={index} className="legal-basis-item">
                <div className="legal-basis-name">법령명: {basis.name}</div>
                <div className="legal-basis-meta">
                  시행일: {basis.effectiveFrom} {basis.note && `(${basis.note})`}
                </div>
                {basis.sourceUrl && (
                  <div className="legal-basis-source">
                    출처: <a 
                      href={basis.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="legal-basis-link"
                    >
                      {basis.sourceUrl}
                    </a>
                  </div>
                )}
                {basis.citationText && (
                  <div className="legal-basis-citation">{basis.citationText}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 계산 공식 요약 */}
        {result.calculatorId && (() => {
          const definition = getCalculatorDefinition(result.calculatorId)
          if (definition && definition.formulaSummary) {
            return (
              <div className="result-formula-summary">
                <div className="formula-summary-title">계산 공식 요약</div>
                <div className="formula-summary-content">
                  {definition.formulaSummary.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            )
          }
          return null
        })()}

        {/* 면책 문구 */}
        {result.disclaimers && result.disclaimers.length > 0 && (
          <div className="result-disclaimer">
            {result.disclaimers.map((disclaimer, index) => (
              <div key={index} style={{ marginBottom: index < result.disclaimers.length - 1 ? '8px' : '0' }}>
                {disclaimer}
              </div>
            ))}
          </div>
        )}

        {/* 공유 버튼 */}
        <div className="result-share-section">
          <button 
            className="share-button"
            onClick={handleShareLink}
            disabled={isSharing}
          >
            <span className="share-icon">🔗</span>
            링크 공유
          </button>
          <button 
            className="share-button"
            onClick={handleSaveImage}
            disabled={isSharing}
          >
            <span className="share-icon">💾</span>
            {isSharing ? '저장 중...' : '이미지 저장'}
          </button>
          {navigator.share && (
            <button 
              className="share-button primary"
              onClick={handleShareImage}
              disabled={isSharing}
            >
              <span className="share-icon">📤</span>
              {isSharing ? '공유 중...' : '이미지 공유'}
            </button>
          )}
        </div>

        {shareMessage && (
          <div className="share-message">{shareMessage}</div>
        )}
      </div>
    </div>
  )
}

export default ResultCard
