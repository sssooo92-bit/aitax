import React, { useState } from 'react'
import './FormBase.css'

const InheritanceTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    totalInheritance: '',
    heirCount: '1',
    hasSpouse: '예'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const totalInheritance = parseFloat(formData.totalInheritance.replace(/,/g, '')) || 0
    const heirCount = parseInt(formData.heirCount) || 1
    const hasSpouse = formData.hasSpouse === '예'

    // 간단한 계산 로직
    let deduction = 0
    
    // 기본 공제
    deduction += 200000000 // 기본 공제 2억원
    
    // 상속인 공제
    deduction += heirCount * 50000000 // 상속인당 5천만원
    
    // 배우자 공제
    if (hasSpouse) {
      deduction += 500000000 // 배우자 공제 5억원
    }

    const taxableAmount = Math.max(0, totalInheritance - deduction)
    const taxRate = taxableAmount > 1000000000 ? 0.5 : 0.2 // 10억 초과 시 50%, 미만 시 20%
    const expectedTax = Math.floor(taxableAmount * taxRate)

    const result = {
      expectedTax: expectedTax.toLocaleString(),
      deductionSummary: `기본공제 2억원 + 상속인공제 ${(heirCount * 5000).toLocaleString()}만원${hasSpouse ? ' + 배우자공제 5억원' : ''} = ${(deduction / 10000).toLocaleString()}만원 공제 적용`,
      summary: `상속인 ${heirCount}명 기준으로 계산되었습니다.`
    }

    onCalculate(result)
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h3 className="form-title">상속세 계산</h3>
      
      <div className="form-group">
        <label>상속 재산 총액 (원)</label>
        <input
          type="text"
          name="totalInheritance"
          value={formData.totalInheritance}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, totalInheritance: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 1000000000"
          required
        />
      </div>

      <div className="form-group">
        <label>상속인 수</label>
        <input
          type="number"
          name="heirCount"
          value={formData.heirCount}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <div className="form-group">
        <label>배우자 상속 여부</label>
        <select name="hasSpouse" value={formData.hasSpouse} onChange={handleChange} required>
          <option value="예">예</option>
          <option value="아니오">아니오</option>
        </select>
      </div>

      <button type="submit" className="calculate-button">상속세 계산하기</button>
    </form>
  )
}

export default InheritanceTaxForm

