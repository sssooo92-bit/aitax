import React, { useState } from 'react'
import TopNavigation from './components/TopNavigation'
import MainContent from './components/MainContent'
import './App.css'

// 배경 이미지 import (이미지 파일이 추가되면 주석 해제)
// import bgImage from './assets/bg.jpg'

function App() {
  const [selectedMainCategory, setSelectedMainCategory] = useState('거래비용 계산')
  const [selectedSubCategory, setSelectedSubCategory] = useState('중개수수료')

  const handleSelectMainCategory = (category) => {
    setSelectedMainCategory(category)
    // 대분류 변경 시 첫 번째 소분류 자동 선택
    const subCategories = {
      '거래비용 계산': '중개수수료',
      '취득세 계산': '주택 취득세',
      '보유세 계산': '재산세 계산',
      '양도세 계산': '양도소득세(주택)',
      '증여·상속 계산': '증여세 계산',
      '투자·수익 계산': '투자수익률 계산',
      '금융 계산 도구': '주택담보대출 계산',
      '단위·환산 도구': '평 ↔ ㎡ 변환',
      '기타 편의 계산': '취등록세 빠른 계산'
    }
    setSelectedSubCategory(subCategories[category] || '')
  }

  const handleSelectSubCategory = (subCategory) => {
    setSelectedSubCategory(subCategory)
  }

  return (
    <div className="app-root">
      <div className="bg-watermark" />
      <div className="app-content">
        <TopNavigation
          selectedMainCategory={selectedMainCategory}
          selectedSubCategory={selectedSubCategory}
          onSelectMainCategory={handleSelectMainCategory}
          onSelectSubCategory={handleSelectSubCategory}
        />
        <MainContent
          selectedMainCategory={selectedMainCategory}
          selectedSubCategory={selectedSubCategory}
        />
      </div>
    </div>
  )
}

export default App
