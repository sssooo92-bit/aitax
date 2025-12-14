import React, { useState } from 'react'
import './CalculatorRenderer.css'

const CalculatorRenderer = ({ schema, onCalculate }) => {
  const [formData, setFormData] = useState(() => {
    const initial = {}
    schema.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initial[field.key] = field.defaultValue
      } else if (field.type === 'select') {
        initial[field.key] = field.options[0]
      } else if (field.type === 'toggle') {
        initial[field.key] = field.options[0]
      } else {
        initial[field.key] = ''
      }
    })
    return initial
  })

  const [errors, setErrors] = useState({})

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    // 에러 초기화
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    schema.fields.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label}을(를) 입력해주세요.`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    try {
      const result = schema.compute(formData)
      onCalculate(result)
    } catch (error) {
      console.error('Calculation error:', error)
      onCalculate({
        error: '계산 중 오류가 발생했습니다. 입력값을 확인해주세요.'
      })
    }
  }

  const renderField = (field) => {
    const value = formData[field.key] || ''
    const error = errors[field.key]

    switch (field.type) {
      case 'select':
        return (
          <div key={field.key} className="form-field">
            <label>{field.label} {field.required && <span className="required">*</span>}</label>
            <select
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={error ? 'error' : ''}
            >
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      case 'toggle':
        return (
          <div key={field.key} className="form-field">
            <label>{field.label} {field.required && <span className="required">*</span>}</label>
            <div className="toggle-group">
              {field.options.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`toggle-button ${value === option ? 'active' : ''}`}
                  onClick={() => handleChange(field.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className="form-field">
            <label>{field.label} {field.required && <span className="required">*</span>}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className="form-field">
            <label>{field.label} {field.required && <span className="required">*</span>}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const numValue = e.target.value.replace(/[^0-9]/g, '')
                const formatted = numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                handleChange(field.key, formatted)
              }}
              placeholder={field.placeholder}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form className="calculator-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {schema.fields.map(field => renderField(field))}
      </div>
      <button type="submit" className="calculate-button">
        계산하기
      </button>
    </form>
  )
}

export default CalculatorRenderer



