import React, { useState } from 'react'
import './FormStyles.css'

const HouseCountJudgmentForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    currentHouseCount: '1',
    existingHouseDate: '',
    newHouseDate: '',
    newHouseSaleDate: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const currentHouseCount = formData.currentHouseCount
    const existingHouseDate = new Date(formData.existingHouseDate)
    const newHouseDate = new Date(formData.newHouseDate)
    const newHouseSaleDate = formData.newHouseSaleDate ? new Date(formData.newHouseSaleDate) : null

    // 간단한 판단 로직
    const daysBetween = Math.floor((newHouseDate - existingHouseDate) / (1000 * 60 * 60 * 24))
    const isTemporaryTwoHouse = daysBetween <= 365 // 1년 이내

    let isSingleHouseRecognized = false
    let isTemporaryTwoHousePossible = false
    let summary = ''

    if (currentHouseCount === '1') {
      isSingleHouseRecognized = true
      summary = '현재 1주택 보유로 1주택 인정됩니다.'
    } else if (currentHouseCount === '2') {
      if (isTemporaryTwoHouse && newHouseSaleDate) {
        const saleDays = Math.floor((newHouseSaleDate - existingHouseDate) / (1000 * 60 * 60 * 24))
        if (saleDays <= 365) {
          isTemporaryTwoHousePossible = true
          isSingleHouseRecognized = true
          summary = '일시적 2주택으로 인정되며, 기존 주택 양도 시 1주택 비과세 가능합니다.'
        } else {
          summary = '2주택 보유 기간이 길어 일시적 2주택 인정이 어렵습니다.'
        }
      } else {
        summary = '2주택 보유로 1주택 인정이 어렵습니다.'
      }
    }

    const result = {
      isSingleHouseRecognized: isSingleHouseRecognized ? '1주택 인정' : '1주택 비인정',
      isTemporaryTwoHousePossible: isTemporaryTwoHousePossible ? '일시적 2주택 가능' : '일시적 2주택 불가능',
      summary: summary
    }

    onCalculate(result)
  }

  return (
    <form className="tax-form" onSubmit={handleSubmit}>
      <h3 className="form-title">주택 수·비과세 판단</h3>
      
      <div className="form-group">
        <label>현재 보유 주택 수</label>
        <select name="currentHouseCount" value={formData.currentHouseCount} onChange={handleChange} required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3 이상">3 이상</option>
        </select>
      </div>

      <div className="form-group">
        <label>기존 주택 취득일</label>
        <input type="date" name="existingHouseDate" value={formData.existingHouseDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>신규 주택 취득일</label>
        <input type="date" name="newHouseDate" value={formData.newHouseDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>신규 주택 양도 예정일 (선택)</label>
        <input type="date" name="newHouseSaleDate" value={formData.newHouseSaleDate} onChange={handleChange} />
      </div>

      <button type="submit" className="calculate-button">비과세 가능 여부 확인</button>
    </form>
  )
}

export default HouseCountJudgmentForm



