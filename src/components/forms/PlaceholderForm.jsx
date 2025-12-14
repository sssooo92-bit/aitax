import React from 'react'
import './FormBase.css'

const PlaceholderForm = ({ onCalculate, title }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onCalculate({
      summary: `${title} 계산 폼이 준비 중입니다.`
    })
  }

  return (
    <form className="form-base" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>계산 항목</label>
        <input type="text" placeholder="입력하세요" disabled />
      </div>
      <button type="submit" className="calculate-button" disabled>준비 중</button>
    </form>
  )
}

export default PlaceholderForm



