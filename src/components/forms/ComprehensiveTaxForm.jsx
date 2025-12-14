import React, { useState } from 'react'
import './FormBase.css'

const ComprehensiveTaxForm = ({ onCalculate }) => {
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

    // 실제 종합부동산세 계산 (2024년 기준)
    let isComprehensiveTaxTarget = false
    let comprehensiveTax = 0
    let threshold = 0
    let taxRate = 0

    // 과세 기준액
    if (isSingleHousehold && houseCount === '1') {
      threshold = 1200000000 // 1세대 1주택 12억원
    } else if (isSingleHousehold && houseCount === '2') {
      threshold = 600000000 // 1세대 2주택 6억원
    } else if (!isSingleHousehold && houseCount === '1') {
      threshold = 600000000 // 다세대 1주택 6억원
    } else {
      threshold = 300000000 // 다주택 3억원
    }

    if (announcedPrice > threshold) {
      isComprehensiveTaxTarget = true
      const excess = announcedPrice - threshold

      // 구간별 세율 적용
      let totalTax = 0
      if (excess > 1000000000) {
        totalTax = Math.floor(200000000 * 0.002) + 
                   Math.floor(300000000 * 0.003) + 
                   Math.floor(500000000 * 0.004) + 
                   Math.floor((excess - 1000000000) * 0.005)
        taxRate = 0.005
      } else if (excess > 500000000) {
        totalTax = Math.floor(200000000 * 0.002) + 
                   Math.floor(300000000 * 0.003) + 
                   Math.floor((excess - 500000000) * 0.004)
        taxRate = 0.004
      } else if (excess > 200000000) {
        totalTax = Math.floor(200000000 * 0.002) + 
                   Math.floor((excess - 200000000) * 0.003)
        taxRate = 0.003
      } else {
        totalTax = Math.floor(excess * 0.002)
        taxRate = 0.002
      }

      comprehensiveTax = totalTax
    }

    onCalculate({
      isComprehensiveTaxTarget: isComprehensiveTaxTarget ? '종부세 대상' : '종부세 비대상',
      comprehensiveTax: comprehensiveTax.toLocaleString(),
      threshold: threshold.toLocaleString(),
      taxRate: isComprehensiveTaxTarget ? (taxRate * 100).toFixed(2) : null,
      summary: `${houseCount}주택 ${isSingleHousehold ? '(1세대 1주택)' : '(다주택)'} 기준 종합부동산세입니다. ${isComprehensiveTaxTarget ? `과세기준액: ${threshold.toLocaleString()}원` : ''}`
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

export default ComprehensiveTaxForm

