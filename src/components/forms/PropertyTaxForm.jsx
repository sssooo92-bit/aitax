import React, { useState } from 'react'
import './FormBase.css'

const PropertyTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    announcedPrice: '',
    houseCount: '1',
    isSingleHousehold: '예'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const announcedPrice = parseFloat(formData.announcedPrice.replace(/,/g, '')) || 0
    const houseCount = formData.houseCount
    const isSingleHousehold = formData.isSingleHousehold === '예'

    // 실제 재산세 계산 (2024년 기준)
    let propertyTaxRate = 0.001 // 기본 0.1%
    let deduction = 0
    let isExempt = false

    // 1세대 1주택 공제
    if (isSingleHousehold && houseCount === '1') {
      deduction = 110000000 // 1억 1천만원 공제
      isExempt = announcedPrice <= deduction
    }

    const taxableAmount = Math.max(0, announcedPrice - deduction)
    const propertyTax = isExempt ? 0 : Math.floor(taxableAmount * propertyTaxRate)

    let summary = ''
    if (isExempt) {
      summary = '1세대 1주택으로 재산세 면제 대상입니다.'
    } else {
      summary = `${houseCount}주택 ${isSingleHousehold ? '(1세대 1주택)' : '(다주택)'} 기준 재산세입니다.`
      if (deduction > 0) {
        summary += ` 공제액: ${deduction.toLocaleString()}원`
      }
    }

    onCalculate({
      propertyTax: propertyTax.toLocaleString(),
      taxRate: '0.1',
      deduction: deduction > 0 ? deduction.toLocaleString() : null,
      summary: summary
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>주택 공시가격 (원)</label>
        <input
          type="text"
          name="announcedPrice"
          value={formData.announcedPrice}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, announcedPrice: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 800000000"
          required
        />
      </div>

      <div className="form-group">
        <label>보유 주택 수</label>
        <select name="houseCount" value={formData.houseCount} onChange={handleChange} required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3 이상">3 이상</option>
        </select>
      </div>

      <div className="form-group">
        <label>1세대 1주택 여부</label>
        <select name="isSingleHousehold" value={formData.isSingleHousehold} onChange={handleChange} required>
          <option value="예">예</option>
          <option value="아니오">아니오</option>
        </select>
      </div>

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default PropertyTaxForm

