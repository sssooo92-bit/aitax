import React, { useState } from 'react'
import './FormStyles.css'

const HoldingTaxForm = ({ onCalculate }) => {
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

    // 간단한 계산 로직
    let propertyTaxRate = 0.001 // 재산세 0.1%
    let isComprehensiveTaxTarget = false

    // 재산세 계산
    const propertyTax = Math.floor(announcedPrice * propertyTaxRate)

    // 종부세 대상 판단
    if (announcedPrice > 600000000 && !isSingleHousehold) {
      isComprehensiveTaxTarget = true
    } else if (announcedPrice > 900000000 && isSingleHousehold) {
      isComprehensiveTaxTarget = true
    }

    let comprehensiveTax = 0
    if (isComprehensiveTaxTarget) {
      const excess = announcedPrice - (isSingleHousehold ? 900000000 : 600000000)
      comprehensiveTax = Math.floor(excess * 0.002) // 종부세 0.2%
    }

    const result = {
      propertyTax: propertyTax.toLocaleString(),
      isComprehensiveTaxTarget: isComprehensiveTaxTarget ? '종부세 대상' : '종부세 비대상',
      comprehensiveTax: comprehensiveTax.toLocaleString(),
      summary: `${houseCount}주택 보유, ${isSingleHousehold ? '1세대 1주택' : '다주택'} 기준으로 계산되었습니다.`
    }

    onCalculate(result)
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h3 className="form-title">보유세 계산 (재산세·종부세)</h3>
      
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

      <button type="submit" className="calculate-button">보유세 계산하기</button>
    </form>
  )
}

export default HoldingTaxForm



