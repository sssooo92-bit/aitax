import React, { useState, useEffect } from 'react'
import { getSchemaById, calculatorSchemas } from '../lib/calculators'
import CalculatorRenderer from './CalculatorRenderer'
import ResultCard from './ResultCard'
import LegalBasisBox from './LegalBasisBox'
import LegalBasisPanel from './LegalBasisPanel'
import './CalculationForm.css'

const CalculationForm = ({ selectedMainCategory, selectedSubCategory, onCalculate }) => {
  const [result, setResult] = useState(null)
  const [schema, setSchema] = useState(null)

  // 소분류 이름을 스키마 ID로 매핑
  const subCategoryToIdMap = {
    // 거래비용 계산
    '중개수수료': 'brokerage-fee',
    '법무사/등기비용': 'notary-fee',
    '인지세 · 채권 · 부가세': 'stamp-tax',
    '취득 부대비용 종합': 'brokerage-fee', // 임시 매핑
    
    // 취득세 계산
    '주택 취득세': 'acquisition-tax',
    '오피스텔 취득세': 'acquisition-tax-detail',
    '상가·토지 취득세': 'acquisition-tax-detail',
    '다주택 취득세': 'multi-house-surcharge',
    '생애최초 취득세': 'first-time-buyer',
    '취득세 세부옵션': 'acquisition-tax-detail',
    
    // 보유세 계산
    '재산세 계산': 'property-tax',
    '종합부동산세': 'comprehensive-tax',
    '보유세 종합 계산': 'property-tax', // 임시 매핑
    '1주택자 보유세': 'property-tax', // 임시 매핑
    '다주택자 보유세': 'comprehensive-tax', // 임시 매핑
    
    // 양도세 계산
    '양도소득세(주택)': 'capital-gains-tax',
    '양도소득세(상가/토지)': 'capital-gains-tax',
    '1세대 1주택': 'one-house-exemption',
    '다주택 양도세': 'multi-house-surcharge',
    '장기보유특별공제': 'capital-gains-tax', // 임시 매핑
    '양도세 절세 시뮬레이션': 'capital-gains-tax', // 임시 매핑
    
    // 증여·상속 계산
    '증여세 계산': 'gift-tax',
    '상속세 계산': 'inheritance-tax',
    '증여·상속 비교': 'gift-tax', // 임시 매핑
    '가족 간 증여 시뮬레이션': 'gift-tax', // 임시 매핑
    
    // 투자·수익 계산
    '투자수익률 계산': 'rental-yield',
    '월세 수익 분석': 'deemed-rental',
    '대출이자 계산': 'loan-calculation',
    '보유 vs 매도 비교': 'optimal-price', // 임시 매핑
    '투자 종합 시뮬레이션': 'rental-yield', // 임시 매핑
    
    // 금융 계산 도구
    '주택담보대출 계산': 'loan-calculation',
    '원리금/원금균등 계산': 'loan-calculation',
    'LTV / DSR 계산': 'dti-dsr',
    '금리 비교 계산': 'loan-calculation', // 임시 매핑
    
    // 단위·환산 도구
    '평 ↔ ㎡ 변환': 'area-conversion',
    '세율 계산기': 'area-conversion', // 임시 매핑
    '금액 퍼센트 계산': 'area-conversion', // 임시 매핑
    
    // 기타 편의 계산
    '취등록세 빠른 계산': 'stamp-tax', // 임시 매핑
    '계약금·중도금·잔금 계산': 'brokerage-fee', // 임시 매핑
    '임대차 비용 계산': 'deposit-insurance'
  }

  useEffect(() => {
    if (selectedSubCategory) {
      const schemaId = subCategoryToIdMap[selectedSubCategory]
      if (schemaId) {
        const foundSchema = getSchemaById(schemaId)
        setSchema(foundSchema)
        setResult(null) // 카테고리 변경 시 결과 초기화
      } else {
        setSchema(null)
      }
    }
  }, [selectedSubCategory])

  const handleCalculate = (calculationResult) => {
    setResult(calculationResult)
    // 챗봇에도 결과 요약 전송
    if (calculationResult.summary && onCalculate) {
      onCalculate(calculationResult)
    }
  }

  if (!selectedSubCategory) {
    return (
      <div className="calculation-form-container">
        <div className="empty-state">
          <p>계산할 항목을 선택해주세요.</p>
        </div>
      </div>
    )
  }

  if (!schema) {
    return (
      <div className="calculation-form-container">
        <div className="empty-state">
          <p>계산 폼을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  const categoryIcons = {
    // 거래비용 계산
    '중개수수료': '💼',
    '법무사/등기비용': '📋',
    '인지세 · 채권 · 부가세': '📄',
    '취득 부대비용 종합': '💰',
    
    // 취득세 계산
    '주택 취득세': '🏠',
    '오피스텔 취득세': '🏢',
    '상가·토지 취득세': '🏪',
    '다주택 취득세': '🏘️',
    '생애최초 취득세': '🎯',
    '취득세 세부옵션': '⚙️',
    
    // 보유세 계산
    '재산세 계산': '📑',
    '종합부동산세': '📊',
    '보유세 종합 계산': '📈',
    '1주택자 보유세': '🏠',
    '다주택자 보유세': '🏘️',
    
    // 양도세 계산
    '양도소득세(주택)': '🔄',
    '양도소득세(상가/토지)': '🔄',
    '1세대 1주택': '✅',
    '다주택 양도세': '⚠️',
    '장기보유특별공제': '🎁',
    '양도세 절세 시뮬레이션': '💡',
    
    // 증여·상속 계산
    '증여세 계산': '🎁',
    '상속세 계산': '👨‍👩‍👧‍👦',
    '증여·상속 비교': '⚖️',
    '가족 간 증여 시뮬레이션': '💝',
    
    // 투자·수익 계산
    '투자수익률 계산': '📈',
    '월세 수익 분석': '💰',
    '대출이자 계산': '💳',
    '보유 vs 매도 비교': '⚖️',
    '투자 종합 시뮬레이션': '📊',
    
    // 금융 계산 도구
    '주택담보대출 계산': '🏦',
    '원리금/원금균등 계산': '📊',
    'LTV / DSR 계산': '📐',
    '금리 비교 계산': '💹',
    
    // 단위·환산 도구
    '평 ↔ ㎡ 변환': '📐',
    '세율 계산기': '🧮',
    '금액 퍼센트 계산': '💯',
    
    // 기타 편의 계산
    '취등록세 빠른 계산': '⚡',
    '계약금·중도금·잔금 계산': '💵',
    '임대차 비용 계산': '🏘️'
  }

  const icon = categoryIcons[selectedSubCategory] || '📝'

  return (
    <div className="calculation-form-container">
      <div className="form-title-bar">
        <h2 className="form-title">
          {selectedSubCategory}
        </h2>
      </div>
      <div className="form-content">
        <CalculatorRenderer schema={schema} onCalculate={handleCalculate} />
        {result && <ResultCard result={result} category={selectedSubCategory} />}
        <LegalBasisBox subCategory={selectedSubCategory} calculatorId={result?.calculatorId} />
        <LegalBasisPanel majorKey={selectedMainCategory} minorKey={selectedSubCategory} />
      </div>
    </div>
  )
}

export default CalculationForm

