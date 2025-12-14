import React, { useState } from 'react'
import './FormBase.css'

const CapitalGainsTaxForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    purchasePrice: '',
    salePrice: '',
    purchaseDate: '',
    saleDate: '',
    houseCount: '1',
    isAdjustmentArea: '아니오',
    expenses: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const purchasePrice = parseFloat(formData.purchasePrice.replace(/,/g, '')) || 0
    const salePrice = parseFloat(formData.salePrice.replace(/,/g, '')) || 0
    const expenses = parseFloat(formData.expenses.replace(/,/g, '')) || 0
    const purchaseDate = new Date(formData.purchaseDate)
    const saleDate = new Date(formData.saleDate)

    // 보유기간 계산
    const holdingPeriod = Math.floor((saleDate - purchaseDate) / (1000 * 60 * 60 * 24))
    const holdingYears = holdingPeriod / 365

    // 필요경비 자동 계산 (미입력 시)
    const autoExpenses = expenses || Math.floor(salePrice * 0.05) // 매도가의 5%
    const totalExpenses = expenses || autoExpenses

    const capitalGain = salePrice - purchasePrice - totalExpenses
    const houseCount = formData.houseCount
    const isAdjustmentArea = formData.isAdjustmentArea === '예'

    let taxRate = 0
    let taxType = ''
    let isExempt = false
    let longTermDeduction = 0 // 장기보유특별공제

    // 1주택 비과세 판단
    if (houseCount === '1' && !isAdjustmentArea && holdingYears >= 2) {
      isExempt = true
      taxRate = 0
      taxType = '1주택 비과세 대상 (2년 이상 보유)'
    } else {
      // 장기보유특별공제
      if (holdingYears >= 10) {
        longTermDeduction = capitalGain * 0.8 // 10년 이상 80% 공제
      } else if (holdingYears >= 5) {
        longTermDeduction = capitalGain * 0.6 // 5년 이상 60% 공제
      } else if (holdingYears >= 3) {
        longTermDeduction = capitalGain * 0.4 // 3년 이상 40% 공제
      } else if (holdingYears >= 2) {
        longTermDeduction = capitalGain * 0.2 // 2년 이상 20% 공제
      }

      const taxableGain = Math.max(0, capitalGain - longTermDeduction)

      // 세율 적용
      if (houseCount === '1') {
        taxRate = 0.06
        taxType = '1주택 과세 (6%)'
      } else if (houseCount === '2') {
        taxRate = isAdjustmentArea ? 0.07 : 0.06 // 조정대상지역 7%, 일반 6%
        taxType = `2주택 과세 ${isAdjustmentArea ? '(조정대상지역 가중)' : ''}`
      } else {
        taxRate = isAdjustmentArea ? 0.12 : 0.1 // 조정대상지역 12%, 일반 10%
        taxType = `3주택 이상 중과세 ${isAdjustmentArea ? '(조정대상지역 가중)' : ''}`
      }

      const expectedTax = Math.floor(taxableGain * taxRate)

      onCalculate({
        expectedTax: expectedTax.toLocaleString(),
        capitalGain: capitalGain.toLocaleString(),
        taxableGain: taxableGain.toLocaleString(),
        longTermDeduction: longTermDeduction > 0 ? longTermDeduction.toLocaleString() : null,
        holdingYears: holdingYears.toFixed(1),
        taxRate: (taxRate * 100).toFixed(1),
        taxType: taxType,
        summary: `보유기간 ${holdingYears.toFixed(1)}년, ${houseCount}주택 기준으로 계산되었습니다.`
      })
      return
    }

    onCalculate({
      expectedTax: '0',
      capitalGain: capitalGain.toLocaleString(),
      taxRate: '0',
      taxType: taxType,
      holdingYears: holdingYears.toFixed(1),
      summary: `보유기간 ${holdingYears.toFixed(1)}년, 1주택 비과세 대상입니다.`
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>매수가 (원)</label>
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
        <label>매도가 (원)</label>
        <input
          type="text"
          name="salePrice"
          value={formData.salePrice}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, salePrice: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 700000000"
          required
        />
      </div>

      <div className="form-group">
        <label>취득일</label>
        <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label>양도일</label>
        <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} required />
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
        <label>조정대상지역 여부</label>
        <select name="isAdjustmentArea" value={formData.isAdjustmentArea} onChange={handleChange} required>
          <option value="예">예</option>
          <option value="아니오">아니오</option>
        </select>
      </div>

      <div className="form-group">
        <label>필요경비 (원, 선택)</label>
        <input
          type="text"
          name="expenses"
          value={formData.expenses}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '')
            setFormData(prev => ({ ...prev, expenses: value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }))
          }}
          placeholder="예: 50000000"
        />
      </div>

      <button type="submit" className="calculate-button">계산하기</button>
    </form>
  )
}

export default CapitalGainsTaxForm
