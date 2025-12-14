import React, { useState } from 'react'
import './FormStyles.css'

const OtherTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    calculationType: '장기보유특별공제',
    amount: '',
    period: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const calculationType = formData.calculationType
    const amount = parseFloat(formData.amount.replace(/,/g, '')) || 0
    const period = parseInt(formData.period) || 0

    let result = {}

    if (calculationType === '장기보유특별공제') {
      let deductionRate = 0
      if (period >= 10) {
        deductionRate = 0.8 // 10년 이상 80%
      } else if (period >= 5) {
        deductionRate = 0.6 // 5년 이상 60%
      } else if (period >= 3) {
        deductionRate = 0.4 // 3년 이상 40%
      } else if (period >= 2) {
        deductionRate = 0.2 // 2년 이상 20%
      }
      
      const deduction = Math.floor(amount * deductionRate)
      result = {
        calculationType: '장기보유특별공제',
        result: `${period}년 보유 시 ${(deductionRate * 100).toFixed(0)}% 공제 적용`,
        deductionAmount: deduction.toLocaleString(),
        summary: `보유기간 ${period}년 기준 장기보유특별공제가 적용됩니다.`
      }
    } else if (calculationType === '필요경비') {
      const recognizedExpenses = Math.floor(amount * 0.05) // 5% 인정
      result = {
        calculationType: '필요경비',
        result: `일반적으로 매도가의 5% 인정`,
        recognizedAmount: recognizedExpenses.toLocaleString(),
        summary: `매도가 ${(amount / 10000).toLocaleString()}만원 기준 필요경비는 약 ${(recognizedExpenses / 10000).toLocaleString()}만원입니다.`
      }
    } else if (calculationType === '세율 확인') {
      let taxRate = 0.06 // 기본 6%
      if (period >= 2) {
        taxRate = 0.06
      } else {
        taxRate = 0.06
      }
      result = {
        calculationType: '세율 확인',
        result: `양도소득세율 ${(taxRate * 100).toFixed(1)}%`,
        summary: `보유기간 및 주택 수에 따라 세율이 달라질 수 있습니다.`
      }
    }

    onCalculate(result)
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h3 className="form-title">기타 부동산 계산</h3>
      
      <div className="form-group">
        <label>계산 항목 선택</label>
        <select name="calculationType" value={formData.calculationType} onChange={handleChange} required>
          <option value="장기보유특별공제">장기보유특별공제</option>
          <option value="필요경비">필요경비</option>
          <option value="세율 확인">세율 확인</option>
        </select>
      </div>

      <div className="form-group">
        <label>금액 (원, 선택)</label>
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, amount: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 500000000"
        />
      </div>

      <div className="form-group">
        <label>기간 (년, 선택)</label>
        <input
          type="number"
          name="period"
          value={formData.period}
          onChange={handleChange}
          placeholder="예: 5"
          min="0"
        />
      </div>

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default OtherTaxForm



