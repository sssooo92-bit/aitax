import React, { useState } from 'react'
import './AdBanner.css'

const AdBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  // 광고 이미지 경로 및 링크 (순서대로)
  const adImages = [
    {
      id: 1,
      src: '/ads/ad1.jpg.jpg',
      alt: '노란우산',
      link: 'https://www.8899.or.kr/'
    },
    {
      id: 2,
      src: '/ads/ad2.jpg.jpg',
      alt: '서울신용보증재단',
      link: 'https://www.seoulshinbo.co.kr/'
    },
    {
      id: 3,
      src: '/ads/ad3.jpg.jpg',
      alt: '법률사무소 남',
      link: 'https://lawfirmnamcompany.kr/'
    },
    {
      id: 4,
      src: '/ads/ad4.jpg.jpg',
      alt: '알리다',
      link: 'https://alrigo.co.kr/'
    },
    {
      id: 5,
      src: '/ads/ad5.jpg.jpg',
      alt: '프레시원',
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSdP-wd6t3nBY0qtKxtw_h4OwPBudRrMuN3sWf-_aDg-hxzqJQ/viewform'
    }
  ]

  const handleAdClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      {/* 모바일에서 광고 보기 버튼 */}
      <button 
        className="ad-toggle-mobile"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="광고 보기"
      >
        {isExpanded ? '광고 숨기기' : '광고 보기'}
      </button>

      {/* 광고 배너 컨테이너 */}
      <div className={`ad-banner-container ${isExpanded ? 'expanded' : ''}`}>
        <div className="ad-banner-list">
          {adImages.map((ad) => (
            <a
              key={ad.id}
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="ad-banner-item"
              onClick={(e) => {
                e.preventDefault()
                handleAdClick(ad.link)
              }}
            >
              <img
                src={ad.src}
                alt={ad.alt}
                className="ad-banner-image"
                loading="lazy"
                onError={(e) => {
                  // 이미지 로드 실패 시 placeholder 표시
                  if (!e.target.parentElement.querySelector('.ad-placeholder')) {
                    e.target.style.display = 'none'
                    const placeholder = document.createElement('div')
                    placeholder.className = 'ad-placeholder'
                    placeholder.textContent = '광고 이미지 준비중'
                    e.target.parentElement.appendChild(placeholder)
                  }
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdBanner

