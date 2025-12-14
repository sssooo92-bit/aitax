import React from 'react'
import './Sidebar.css'

const Sidebar = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    '취득세 계산',
    '양도소득세 계산',
    '보유세 계산 (재산세·종부세)',
    '증여세 계산',
    '상속세 계산',
    '중과·감면 계산',
    '주택 수·비과세 판단',
    '기타 부동산 계산'
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>부동산 계산</h2>
      </div>
      <nav className="sidebar-nav">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar

