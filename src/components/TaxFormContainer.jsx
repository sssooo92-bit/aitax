import React, { useState, useEffect } from 'react'
import AcquisitionTaxForm from './forms/AcquisitionTaxForm'
import CapitalGainsTaxForm from './forms/CapitalGainsTaxForm'
import HoldingTaxForm from './forms/HoldingTaxForm'
import GiftTaxForm from './forms/GiftTaxForm'
import InheritanceTaxForm from './forms/InheritanceTaxForm'
import SurchargeExemptionForm from './forms/SurchargeExemptionForm'
import HouseCountJudgmentForm from './forms/HouseCountJudgmentForm'
import OtherTaxForm from './forms/OtherTaxForm'
import ResultCard from './ResultCard'

const TaxFormContainer = ({ selectedCategory }) => {
  const [result, setResult] = useState(null)

  // 카테고리 변경 시 결과 초기화
  useEffect(() => {
    setResult(null)
  }, [selectedCategory])

  const handleCalculate = (calculationResult) => {
    setResult(calculationResult)
  }

  const renderForm = () => {
    switch (selectedCategory) {
      case '취득세 계산':
        return <AcquisitionTaxForm onCalculate={handleCalculate} />
      case '양도소득세 계산':
        return <CapitalGainsTaxForm onCalculate={handleCalculate} />
      case '보유세 계산 (재산세·종부세)':
        return <HoldingTaxForm onCalculate={handleCalculate} />
      case '증여세 계산':
        return <GiftTaxForm onCalculate={handleCalculate} />
      case '상속세 계산':
        return <InheritanceTaxForm onCalculate={handleCalculate} />
      case '중과·감면 계산':
        return <SurchargeExemptionForm onCalculate={handleCalculate} />
      case '주택 수·비과세 판단':
        return <HouseCountJudgmentForm onCalculate={handleCalculate} />
      case '기타 부동산 계산':
        return <OtherTaxForm onCalculate={handleCalculate} />
      default:
        return null
    }
  }

  return (
    <div className="tax-form-container">
      {renderForm()}
      {result && <ResultCard result={result} category={selectedCategory} />}
    </div>
  )
}

export default TaxFormContainer

