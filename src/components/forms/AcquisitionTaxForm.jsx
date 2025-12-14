import React, { useState } from 'react'
import './FormBase.css'

const AcquisitionTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    transactionType: '주택',
    purchasePrice: '',
    houseCount: '1',
    isAdjustmentArea: '아니오',
    isFirstTimeBuyer: '아니오'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggle = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const purchasePrice = parseFloat(formData.purchasePrice.replace(/,/g, '')) || 0
    const houseCount = formData.houseCount
    const isAdjustmentArea = formData.isAdjustmentArea === '예'
    const isFirstTimeBuyer = formData.isFirstTimeBuyer === '예'
    const transactionType = formData.transactionType

    // 실제 취득세 계산 로직 (2024년 기준)
    let taxRate = 0
    let baseRate = 0
    let deduction = 0
    let isExempt = false

    // 생애최초 1주택 면제
    if (isFirstTimeBuyer && houseCount === '1' && transactionType === '주택') {
      isExempt = true
      taxRate = 0
      baseRate = 0
    } else {
      // 기본 세율
      if (houseCount === '1') {
        if (transactionType === '주택') {
          baseRate = isAdjustmentArea ? 0.011 : 0.01 // 조정대상지역 1.1%, 일반 1%
        } else if (transactionType === '오피스텔') {
          baseRate = 0.02 // 오피스텔 2%
        } else {
          baseRate = 0.04 // 토지 4%
        }
      } else if (houseCount === '2') {
        baseRate = isAdjustmentArea ? 0.03 : 0.02 // 조정대상지역 3%, 일반 2%
      } else {
        baseRate = isAdjustmentArea ? 0.08 : 0.04 // 조정대상지역 8%, 일반 4%
      }

      // 공제 적용 (주택 1억원 이하)
      if (transactionType === '주택' && purchasePrice <= 100000000) {
        deduction = purchasePrice * 0.0005 // 0.05% 공제
      }

      taxRate = baseRate
    }

    const taxableAmount = Math.max(0, purchasePrice - deduction)
    const expectedTax = isExempt ? 0 : Math.floor(taxableAmount * taxRate)
    const taxRatePercent = (taxRate * 100).toFixed(2)

    let summary = ''
    if (isExempt) {
      summary = '생애최초 1주택 구매로 취득세 전액 면제 대상입니다.'
    } else {
      summary = `${transactionType} ${houseCount}주택 ${isAdjustmentArea ? '(조정대상지역)' : ''} 기준으로 계산되었습니다.`
      if (deduction > 0) {
        summary += ` 공제액: ${deduction.toLocaleString()}원`
      }
    }

    onCalculate({
      expectedTax: expectedTax.toLocaleString(),
      taxRate: taxRatePercent,
      deduction: deduction > 0 ? deduction.toLocaleString() : null,
      summary: summary
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>거래 유형</label>
        <select name="transactionType" value={formData.transactionType} onChange={handleChange} required>
          <option value="주택">주택</option>
          <option value="오피스텔">오피스텔</option>
          <option value="토지">토지</option>
        </select>
      </div>

      <div className="form-group">
        <label>취득가액 (원)</label>
        <input
          type="text"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, purchasePrice: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 500000000"
          required
        />
      </div>

      <div className="form-group">
        <label>주택수</label>
        <select name="houseCount" value={formData.houseCount} onChange={handleChange} required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3 이상">3 이상</option>
        </select>
      </div>

      <div className="form-group">
        <label>조정대상지역</label>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-button ${formData.isAdjustmentArea === '예' ? 'active' : ''}`}
            onClick={() => handleToggle('isAdjustmentArea', '예')}
          >
            예
          </button>
          <button
            type="button"
            className={`toggle-button ${formData.isAdjustmentArea === '아니오' ? 'active' : ''}`}
            onClick={() => handleToggle('isAdjustmentArea', '아니오')}
          >
            아니오
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>생애최초 여부</label>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-button ${formData.isFirstTimeBuyer === '예' ? 'active' : ''}`}
            onClick={() => handleToggle('isFirstTimeBuyer', '예')}
          >
            예
          </button>
          <button
            type="button"
            className={`toggle-button ${formData.isFirstTimeBuyer === '아니오' ? 'active' : ''}`}
            onClick={() => handleToggle('isFirstTimeBuyer', '아니오')}
          >
            아니오
          </button>
        </div>
      </div>

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default AcquisitionTaxForm
