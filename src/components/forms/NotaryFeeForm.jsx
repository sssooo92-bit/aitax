import React, { useState } from 'react'
import './FormBase.css'

const NotaryFeeForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    registrationType: '매매',
    purchasePrice: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(formData.purchasePrice.replace(/,/g, '')) || 0
    
    let fee = 0
    if (formData.registrationType === '매매') {
      fee = Math.floor(amount * 0.001) + 500000 // 0.1% + 기본 50만원
    } else if (formData.registrationType === '전세') {
      fee = Math.floor(amount * 0.0005) + 300000
    }

    onCalculate({
      notaryFee: fee.toLocaleString(),
      summary: `${formData.registrationType} 등기 기준 법무사/등기비용입니다.`
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>등기유형</label>
        <select name="registrationType" value={formData.registrationType} onChange={handleChange} required>
          <option value="매매">매매</option>
          <option value="전세">전세</option>
          <option value="증여">증여</option>
          <option value="상속">상속</option>
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

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default NotaryFeeForm



