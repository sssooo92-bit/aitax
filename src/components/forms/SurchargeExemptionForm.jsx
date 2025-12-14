import React, { useState } from 'react'
import './FormStyles.css'

const SurchargeExemptionForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    houseCount: '1',
    isAdjustmentArea: '아니오',
    exemptionType: '없음'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const houseCount = formData.houseCount
    const isAdjustmentArea = formData.isAdjustmentArea === '예'
    const exemptionType = formData.exemptionType

    // 간단한 판단 로직
    let isSurchargeTarget = false
    let exemptionPossible = false
    let summary = ''

    if (houseCount === '1') {
      isSurchargeTarget = false
      exemptionPossible = true
      summary = '1주택 보유로 중과 대상이 아닙니다.'
    } else if (houseCount === '2') {
      isSurchargeTarget = true
      if (exemptionType === '생애최초' || exemptionType === '신혼부부') {
        exemptionPossible = true
        summary = `${exemptionType} 감면 대상으로 중과세 감면 가능합니다.`
      } else {
        exemptionPossible = false
        summary = '2주택 보유로 중과세 대상이며, 감면 조건을 충족하지 않습니다.'
      }
    } else if (houseCount === '3 이상') {
      isSurchargeTarget = true
      exemptionPossible = false
      summary = '3주택 이상 보유로 중과세 대상이며 감면 불가능합니다.'
    }

    if (isAdjustmentArea && houseCount !== '1') {
      summary += ' (조정대상지역 가중 적용)'
    }

    const result = {
      isSurchargeTarget: isSurchargeTarget ? '중과 대상' : '중과 비대상',
      exemptionPossible: exemptionPossible ? '감면 가능' : '감면 불가능',
      summary: summary
    }

    onCalculate(result)
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h3 className="form-title">중과·감면 계산</h3>
      
      <div className="form-group">
        <label>보유 주택 수</label>
        <select name="houseCount" value={formData.houseCount} onChange={handleChange} required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3 이상">3 이상</option>
        </select>
      </div>

      <div className="form-group">
        <label>조정대상지역 여부</label>
        <select name="isAdjustmentArea" value={formData.isAdjustmentArea} onChange={handleChange} required>
          <option value="예">예</option>
          <option value="아니오">아니오</option>
        </select>
      </div>

      <div className="form-group">
        <label>생애최초 / 신혼부부 여부</label>
        <select name="exemptionType" value={formData.exemptionType} onChange={handleChange} required>
          <option value="없음">없음</option>
          <option value="생애최초">생애최초</option>
          <option value="신혼부부">신혼부부</option>
        </select>
      </div>

      <button type="submit" className="calculate-button">중과·감면 여부 확인</button>
    </form>
  )
}

export default SurchargeExemptionForm



