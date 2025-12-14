import React, { useState } from 'react'
import './FormBase.css'

const BrokerageFeeForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    transactionType: '매매',
    propertyType: '주택',
    transactionAmount: '',
    feeRate: '0.4'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(formData.transactionAmount.replace(/,/g, '')) || 0

    // 실제 중개수수료 계산 (2024년 기준)
    let totalFee = 0
    let feeRate = 0

    if (formData.transactionType === '매매') {
      // 매매 중개수수료 (구간별 누진)
      if (amount <= 50000000) {
        totalFee = Math.floor(amount * 0.006) // 5000만원 이하 0.6%
        feeRate = 0.006
      } else if (amount <= 200000000) {
        totalFee = Math.floor(50000000 * 0.006) + Math.floor((amount - 50000000) * 0.005) // 2억원 이하 0.5%
        feeRate = 0.005
      } else if (amount <= 900000000) {
        totalFee = Math.floor(50000000 * 0.006) + Math.floor(150000000 * 0.005) + Math.floor((amount - 200000000) * 0.004) // 9억원 이하 0.4%
        feeRate = 0.004
      } else {
        totalFee = Math.floor(50000000 * 0.006) + Math.floor(150000000 * 0.005) + Math.floor(700000000 * 0.004) + Math.floor((amount - 900000000) * 0.009) // 9억원 초과 0.9%
        feeRate = 0.009
      }
    } else if (formData.transactionType === '전세') {
      feeRate = 0.002 // 전세 0.2%
      totalFee = Math.floor(amount * feeRate)
    } else if (formData.transactionType === '월세') {
      feeRate = 0.0005 // 월세 0.05%
      totalFee = Math.floor(amount * feeRate)
    }

    onCalculate({
      brokerageFee: totalFee.toLocaleString(),
      feeRate: (feeRate * 100).toFixed(2),
      summary: `${formData.transactionType} ${formData.propertyType} 기준 중개수수료입니다. ${formData.transactionType === '매매' ? '(구간별 누진 적용)' : ''}`
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>거래 유형</label>
        <select name="transactionType" value={formData.transactionType} onChange={handleChange} required>
          <option value="매매">매매</option>
          <option value="전세">전세</option>
          <option value="월세">월세</option>
        </select>
      </div>

      <div className="form-group">
        <label>부동산 종류</label>
        <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
          <option value="주택">주택</option>
          <option value="오피스텔">오피스텔</option>
          <option value="상가">상가</option>
          <option value="토지">토지</option>
        </select>
      </div>

      <div className="form-group">
        <label>거래금액 (원)</label>
        <input
          type="text"
          name="transactionAmount"
          value={formData.transactionAmount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, transactionAmount: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 500000000"
          required
        />
      </div>

      {formData.transactionType === '매매' && (
        <div className="form-group">
          <label>수수료율 기준 (%)</label>
          <select name="feeRate" value={formData.feeRate} onChange={handleChange}>
            <option value="0.4">0.4% (일반)</option>
            <option value="0.5">0.5% (고가)</option>
            <option value="0.3">0.3% (저가)</option>
          </select>
        </div>
      )}

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default BrokerageFeeForm

