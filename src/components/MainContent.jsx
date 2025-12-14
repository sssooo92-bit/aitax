import React, { useState } from 'react'
import CalculationForm from './CalculationForm'
import ResultCard from './ResultCard'
import Chatbot from './Chatbot'
import AdBanner from './AdBanner'
import './MainContent.css'

const MainContent = ({ selectedMainCategory, selectedSubCategory }) => {
  const [calculationResult, setCalculationResult] = useState(null)

  const handleCalculate = (result) => {
    setCalculationResult(result)
  }

  return (
    <div className="main-content">
      <div className="main-container">
        <div className="form-section">
          <CalculationForm
            selectedMainCategory={selectedMainCategory}
            selectedSubCategory={selectedSubCategory}
            onCalculate={handleCalculate}
          />
        </div>
        <div className="result-ai-section">
          {calculationResult && (
            <ResultCard
              result={calculationResult}
              category={selectedSubCategory}
            />
          )}
          <Chatbot
            selectedMainCategory={selectedMainCategory}
            selectedSubCategory={selectedSubCategory}
            calculationResult={calculationResult}
          />
        </div>
        <div className="ad-section">
          <AdBanner />
        </div>
      </div>
    </div>
  )
}

export default MainContent


