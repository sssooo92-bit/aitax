import React, { useState } from 'react'
import './TopNavigation.css'

const TopNavigation = ({ selectedMainCategory, selectedSubCategory, onSelectMainCategory, onSelectSubCategory }) => {
  const categories = {
    '거래비용 계산': ['중개수수료', '법무사/등기비용', '인지세 · 채권 · 부가세', '취득 부대비용 종합'],
    '취득세 계산': ['주택 취득세', '오피스텔 취득세', '상가·토지 취득세', '다주택 취득세', '생애최초 취득세', '취득세 세부옵션'],
    '보유세 계산': ['재산세 계산', '종합부동산세', '보유세 종합 계산', '1주택자 보유세', '다주택자 보유세'],
    '양도세 계산': ['양도소득세(주택)', '양도소득세(상가/토지)', '1세대 1주택', '다주택 양도세', '장기보유특별공제', '양도세 절세 시뮬레이션'],
    '증여·상속 계산': ['증여세 계산', '상속세 계산', '증여·상속 비교', '가족 간 증여 시뮬레이션'],
    '투자·수익 계산': ['투자수익률 계산', '월세 수익 분석', '대출이자 계산', '보유 vs 매도 비교', '투자 종합 시뮬레이션'],
    '금융 계산 도구': ['주택담보대출 계산', '원리금/원금균등 계산', 'LTV / DSR 계산', '금리 비교 계산'],
    '단위·환산 도구': ['평 ↔ ㎡ 변환', '세율 계산기', '금액 퍼센트 계산'],
    '기타 편의 계산': ['취등록세 빠른 계산', '계약금·중도금·잔금 계산', '임대차 비용 계산']
  }

  // 아이콘 제거 - 텍스트만 사용

  const mainCategories = Object.keys(categories)

  return (
    <div className="top-navigation">
      <div className="top-nav-main">
        <div className="top-nav-logo">
          AI부동산계산
        </div>
        <div className="top-nav-main-menu">
          {mainCategories.map((category) => (
            <button
              key={category}
              className={`main-category-btn ${selectedMainCategory === category ? 'active' : ''}`}
              onClick={() => onSelectMainCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {selectedMainCategory && (
        <div className="top-nav-sub">
          {categories[selectedMainCategory].map((subCategory) => (
            <button
              key={subCategory}
              className={`sub-category-btn ${selectedSubCategory === subCategory ? 'active' : ''}`}
              onClick={() => onSelectSubCategory(subCategory)}
            >
              {subCategory}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopNavigation

