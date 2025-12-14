import React, { useState } from 'react'
import './FormBase.css'

const StampTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    amount: '',
    taxType: '인지세'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(formData.amount.replace(/,/g, '')) || 0
    
    let tax = 0
    if (formData.taxType === '인지세') {
      tax = Math.floor(amount * 0.0001) // 0.01%
    } else if (formData.taxType === '채권') {
      tax = Math.floor(amount * 0.0002)
    } else if (formData.taxType === '부가세') {
      tax = Math.floor(amount * 0.1) // 10%
    }

    onCalculate({
      taxAmount: tax.toLocaleString(),
      summary: `${formData.taxType} 기준으로 계산되었습니다.`
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>항목 선택</label>
        <select name="taxType" value={formData.taxType} onChange={handleChange} required>
          <option value="인지세">인지세</option>
          <option value="채권">채권</option>
          <option value="부가세">부가세</option>
        </select>
      </div>

      <div className="form-group">
        <label>금액 (원)</label>
        <input
          type="text"
          name="amount"
          value={formData.amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, amount: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 500000000"
          required
        />
      </div>

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default StampTaxForm



