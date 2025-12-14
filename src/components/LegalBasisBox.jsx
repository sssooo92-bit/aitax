import React from 'react'
import { getCalculatorDefinition } from '../lib/calculators/definitions'
import './LegalBasisBox.css'

const LegalBasisBox = ({ calculatorId, subCategory }) => {
  // 소분류를 calculatorId로 매핑
  const subCategoryToIdMap = {
    '중개수수료': 'brokerage-fee-house-sale',
    '인지세 · 채권 · 부가세': 'stamp-tax-contract',
    // 나머지는 추후 추가
  }

  const id = calculatorId || subCategoryToIdMap[subCategory]
  if (!id) return null

  const definition = getCalculatorDefinition(id)
  if (!definition || !definition.legalBasis || definition.legalBasis.length === 0) {
    return null
  }

  const legalBasis = definition.legalBasis[0] // 첫 번째 법령 근거 사용

  return (
    <div className="legal-basis-box">
      <div className="legal-basis-box-title">계산 근거</div>
      <div className="legal-basis-box-content">
        <div className="legal-basis-box-item">
          <div className="legal-basis-box-label">법령명</div>
          <div className="legal-basis-box-value">{legalBasis.name}</div>
        </div>
        <div className="legal-basis-box-item">
          <div className="legal-basis-box-label">시행일</div>
          <div className="legal-basis-box-value">{legalBasis.effectiveFrom}</div>
        </div>
        {legalBasis.sourceUrl && (
          <div className="legal-basis-box-item">
            <div className="legal-basis-box-label">출처</div>
            <a 
              href={legalBasis.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="legal-basis-box-link"
            >
              {legalBasis.sourceUrl}
            </a>
          </div>
        )}
        {definition.description && (
          <div className="legal-basis-box-item">
            <div className="legal-basis-box-label">요약 설명</div>
            <div className="legal-basis-box-value">{definition.description}</div>
          </div>
        )}
        {definition.formulaSummary && (
          <div className="legal-basis-box-item">
            <div className="legal-basis-box-label">계산 공식</div>
            <div className="legal-basis-box-formula">
              {definition.formulaSummary.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LegalBasisBox

