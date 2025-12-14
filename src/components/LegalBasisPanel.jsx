import React, { useState } from 'react'
import { getLegalBasis } from '../data/legalBasis'
import './LegalBasisPanel.css'

const LegalBasisPanel = ({ majorKey, minorKey }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const legalBasisData = getLegalBasis(majorKey, minorKey)

  if (!legalBasisData) {
    return (
      <div className="legal-basis-panel">
        <div className="legal-basis-panel-header">
          <div className="legal-basis-panel-title">법령·근거/계산공식</div>
        </div>
        <div className="legal-basis-panel-content">
          <div className="legal-basis-panel-empty">준비중</div>
        </div>
      </div>
    )
  }

  return (
    <div className="legal-basis-panel">
      <div 
        className="legal-basis-panel-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="legal-basis-panel-title">법령·근거/계산공식</div>
        <div className="legal-basis-panel-toggle">
          {isExpanded ? '▲' : '▼'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="legal-basis-panel-content">
          {/* (A) 요약 */}
          <div className="legal-basis-section">
            <div className="legal-basis-section-label">요약</div>
            <div className="legal-basis-section-value">{legalBasisData.summary}</div>
          </div>

          {/* (B) 시행일 */}
          <div className="legal-basis-section">
            <div className="legal-basis-section-label">시행일</div>
            <div className="legal-basis-section-value">{legalBasisData.effectiveDate}</div>
          </div>

          {/* (C) 근거 */}
          <div className="legal-basis-section">
            <div className="legal-basis-section-label">근거(조문/별표)</div>
            <div className="legal-basis-section-value">{legalBasisData.basis}</div>
          </div>

          {/* (D) 공식/계산 로직 */}
          <div className="legal-basis-section">
            <div className="legal-basis-section-label">공식/계산 로직</div>
            <div className="legal-basis-section-formula">{legalBasisData.formula}</div>
          </div>

          {/* (E) 출처 링크 */}
          {legalBasisData.sources && legalBasisData.sources.length > 0 && (
            <div className="legal-basis-section">
              <div className="legal-basis-section-label">출처</div>
              <div className="legal-basis-sources">
                {legalBasisData.sources.map((source, index) => (
                  <a
                    key={index}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="legal-basis-source-link"
                  >
                    {source}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LegalBasisPanel

