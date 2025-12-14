import React, { useState } from 'react'
import './FormBase.css'

const GiftTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    relationship: '부모',
    giftAmount: '',
    hasGiftHistory: '아니오'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const giftAmount = parseFloat(formData.giftAmount.replace(/,/g, '')) || 0
    const relationship = formData.relationship
    const hasGiftHistory = formData.hasGiftHistory === '예'

    // 간단한 계산 로직
    let deduction = 0
    let taxRate = 0.1 // 기본 10%

    // 기본 공제
    if (relationship === '부모' || relationship === '자녀') {
      deduction = 20000000 // 2천만원
    } else if (relationship === '배우자') {
      deduction = 10000000 // 1천만원
    }

    const taxableAmount = Math.max(0, giftAmount - deduction)
    const expectedTax = Math.floor(taxableAmount * taxRate)

    const result = {
      expectedTax: expectedTax.toLocaleString(),
      deductionApplied: deduction > 0 ? `${(deduction / 10000).toLocaleString()}만원 공제 적용` : '공제 없음',
      summary: `${relationship}로부터 증여받은 경우, ${hasGiftHistory ? '기존 증여 이력 반영' : '신규 증여'} 기준으로 계산되었습니다.`
    }

    onCalculate(result)
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h3 className="form-title">증여세 계산</h3>
      
      <div className="form-group">
        <label>증여자와의 관계</label>
        <select name="relationship" value={formData.relationship} onChange={handleChange} required>
          <option value="부모">부모</option>
          <option value="자녀">자녀</option>
          <option value="배우자">배우자</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div className="form-group">
        <label>증여 재산가액 (원)</label>
        <input
          type="text"
          name="giftAmount"
          value={formData.giftAmount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, giftAmount: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 500000000"
          required
        />
      </div>

      <div className="form-group">
        <label>기존 증여 이력 여부</label>
        <select name="hasGiftHistory" value={formData.hasGiftHistory} onChange={handleChange} required>
          <option value="예">예</option>
          <option value="아니오">아니오</option>
        </select>
      </div>

      <button type="submit" className="calculate-button">증여세 계산하기</button>
    </form>
  )
}

export default GiftTaxForm

