// 전체 계산 스키마 모음
import { computeBrokerageFee } from './compute/brokerageFee'
import { computeNotaryFee } from './compute/notaryFee'
import { computeStampTax } from './compute/stampTax'
import { computeAcquisitionTax } from './compute/acquisitionTax'
import { computeAcquisitionTaxDetail } from './compute/acquisitionTaxDetail'
import { computeFirstTimeBuyer } from './compute/firstTimeBuyer'
import { computePropertyTax } from './compute/propertyTax'
import { computeComprehensiveTax } from './compute/comprehensiveTax'
import { computeLocalResourceTax } from './compute/localResourceTax'
import { computeCapitalGainsTax } from './compute/capitalGainsTax'
import { computeCorporateTransferTax } from './compute/corporateTransferTax'
import { computeOneHouseExemption } from './compute/oneHouseExemption'
import { computeMultiHouseSurcharge } from './compute/multiHouseSurcharge'
import { computeGiftTax } from './compute/giftTax'
import { computeInheritanceTax } from './compute/inheritanceTax'
import { computeInheritanceShare } from './compute/inheritanceShare'
import { computeRentalYield } from './compute/rentalYield'
import { computeDeemedRental } from './compute/deemedRental'
import { computeOptimalPrice } from './compute/optimalPrice'
import { computeLoanCalculation } from './compute/loanCalculation'
import { computeDTIDSR } from './compute/dtiDsr'
import { computeDepositInsurance } from './compute/depositInsurance'
import { computeAreaConversion } from './compute/areaConversion'
import { computeUnitPrice } from './compute/unitPrice'
import { computeFAR } from './compute/far'
import { computeOverdueRent } from './compute/overdueRent'
import { computeEvictionCost } from './compute/evictionCost'
import { computeGoodLandlord } from './compute/goodLandlord'

export const calculatorSchemas = [
  // [1] 거래비용 계산
  {
    id: 'brokerage-fee',
    title: '중개수수료',
    category: '거래비용 계산',
    fields: [
      { type: 'select', key: 'dealType', label: '거래 유형', required: true, options: ['매매', '전세', '월세'] },
      { type: 'select', key: 'propertyType', label: '부동산 종류', required: true, options: ['주택', '오피스텔', '상가', '토지'] },
      { type: 'number', key: 'amount', label: '거래금액 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'number', key: 'customRate', label: '수수료율 (%)', required: false, placeholder: '기본 0.4%' }
    ],
    compute: computeBrokerageFee
  },
  {
    id: 'notary-fee',
    title: '법무사/등기비용',
    category: '거래비용 계산',
    fields: [
      { type: 'select', key: 'regType', label: '등기유형', required: true, options: ['소유권이전', '근저당설정', '말소'] },
      { type: 'number', key: 'price', label: '기준금액 (원)', required: true, placeholder: '취득가 또는 채권최고액' },
      { type: 'number', key: 'count', label: '건수', required: false, placeholder: '기본 1', defaultValue: 1 }
    ],
    compute: computeNotaryFee
  },
  {
    id: 'stamp-tax',
    title: '인지세/채권/부가세',
    category: '거래비용 계산',
    fields: [
      { type: 'select', key: 'item', label: '항목 선택', required: true, options: ['인지세', '국민주택채권', '부가세(간이)'] },
      { type: 'number', key: 'amount', label: '기준금액 (원)', required: true, placeholder: '계약금액' }
    ],
    compute: computeStampTax
  },
  
  // [2] 취득 관련
  {
    id: 'acquisition-tax',
    title: '취득세 계산',
    category: '취득 관련',
    fields: [
      { type: 'select', key: 'acquireType', label: '거래 유형', required: true, options: ['주택', '오피스텔', '토지'] },
      { type: 'number', key: 'price', label: '취득가액 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'select', key: 'homeCount', label: '주택수', required: true, options: ['1', '2', '3+'] },
      { type: 'toggle', key: 'isAdjust', label: '조정대상지역', required: true, options: ['예', '아니오'] },
      { type: 'toggle', key: 'isFirst', label: '생애최초', required: true, options: ['예', '아니오'] }
    ],
    compute: computeAcquisitionTax
  },
  {
    id: 'acquisition-tax-detail',
    title: '취득세 세부옵션(주택/오피스텔/토지)',
    category: '취득 관련',
    fields: [
      { type: 'select', key: 'acquireType', label: '거래 유형', required: true, options: ['주택', '오피스텔', '토지'] },
      { type: 'number', key: 'price', label: '취득가액 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'select', key: 'homeCount', label: '주택수', required: true, options: ['1', '2', '3+'] },
      { type: 'select', key: 'area', label: '면적', required: false, options: ['60㎡이하', '85㎡이하', '초과'] },
      { type: 'toggle', key: 'isAdjust', label: '조정대상지역', required: true, options: ['예', '아니오'] },
      { type: 'toggle', key: 'isFirst', label: '생애최초', required: true, options: ['예', '아니오'] }
    ],
    compute: computeAcquisitionTaxDetail
  },
  {
    id: 'first-time-buyer',
    title: '생애최초/다주택 여부',
    category: '취득 관련',
    fields: [
      { type: 'select', key: 'homeCount', label: '주택수', required: true, options: ['1', '2', '3+'] },
      { type: 'toggle', key: 'isFirst', label: '생애최초', required: true, options: ['예', '아니오'] },
      { type: 'toggle', key: 'isAdjust', label: '조정대상지역', required: true, options: ['예', '아니오'] },
      { type: 'number', key: 'price', label: '취득가액 (원)', required: true, placeholder: '예: 500000000' }
    ],
    compute: computeFirstTimeBuyer
  },
  
  // [3] 보유세 계산
  {
    id: 'property-tax',
    title: '재산세',
    category: '보유세 계산',
    fields: [
      { type: 'number', key: 'officialPrice', label: '공시가격 (원)', required: true, placeholder: '예: 800000000' },
      { type: 'toggle', key: 'isOneHome', label: '1세대 1주택 여부', required: true, options: ['예', '아니오'] }
    ],
    compute: computePropertyTax
  },
  {
    id: 'comprehensive-tax',
    title: '종합부동산세',
    category: '보유세 계산',
    fields: [
      { type: 'number', key: 'officialPrice', label: '공시가격 (원)', required: true, placeholder: '예: 800000000' },
      { type: 'select', key: 'homeCount', label: '보유 주택 수', required: true, options: ['1', '2', '3+'] },
      { type: 'toggle', key: 'isOneHome', label: '1세대 1주택 여부', required: true, options: ['예', '아니오'] }
    ],
    compute: computeComprehensiveTax
  },
  {
    id: 'local-resource-tax',
    title: '지역자원시설세',
    category: '보유세 계산',
    fields: [
      { type: 'number', key: 'officialPrice', label: '공시가격 (원)', required: true, placeholder: '예: 800000000' }
    ],
    compute: computeLocalResourceTax
  },
  
  // [4] 양도세 계산
  {
    id: 'capital-gains-tax',
    title: '양도소득세(일반)',
    category: '양도세 계산',
    fields: [
      { type: 'number', key: 'buyPrice', label: '매수가 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'number', key: 'sellPrice', label: '매도가 (원)', required: true, placeholder: '예: 700000000' },
      { type: 'date', key: 'buyDate', label: '취득일', required: true },
      { type: 'date', key: 'sellDate', label: '양도일', required: true },
      { type: 'number', key: 'expense', label: '필요경비 (원, 선택)', required: false, placeholder: '예: 50000000' }
    ],
    compute: computeCapitalGainsTax
  },
  {
    id: 'corporate-transfer-tax',
    title: '법인양도세',
    category: '양도세 계산',
    fields: [
      { type: 'number', key: 'gain', label: '양도차익 (원)', required: true, placeholder: '매도가 - 매수가 - 필요경비' },
      { type: 'select', key: 'corpRate', label: '법인세율', required: true, options: ['10', '20', '22'] }
    ],
    compute: computeCorporateTransferTax
  },
  {
    id: 'one-house-exemption',
    title: '1주택 비과세',
    category: '양도세 계산',
    fields: [
      { type: 'toggle', key: 'isOneHome', label: '1주택 여부', required: true, options: ['예', '아니오'] },
      { type: 'number', key: 'holdYears', label: '보유기간 (년)', required: true, placeholder: '예: 2.5' },
      { type: 'number', key: 'liveYears', label: '거주기간 (년)', required: true, placeholder: '예: 2' },
      { type: 'number', key: 'sellPrice', label: '매도가 (원)', required: true, placeholder: '예: 700000000' }
    ],
    compute: computeOneHouseExemption
  },
  {
    id: 'multi-house-surcharge',
    title: '다주택 중과',
    category: '양도세 계산',
    fields: [
      { type: 'select', key: 'homeCount', label: '주택수', required: true, options: ['1', '2', '3+'] },
      { type: 'toggle', key: 'isAdjust', label: '조정대상지역', required: true, options: ['예', '아니오'] },
      { type: 'number', key: 'gain', label: '양도차익 (원)', required: true, placeholder: '매도가 - 매수가 - 필요경비' }
    ],
    compute: computeMultiHouseSurcharge
  },
  
  // [5] 증여/상속 계산
  {
    id: 'gift-tax',
    title: '증여세',
    category: '증여/상속 계산',
    fields: [
      { type: 'select', key: 'relation', label: '증여자와의 관계', required: true, options: ['배우자', '부모-자녀', '기타'] },
      { type: 'number', key: 'value', label: '증여가액 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'toggle', key: 'hasHistory', label: '10년내 증여이력', required: true, options: ['예', '아니오'] }
    ],
    compute: computeGiftTax
  },
  {
    id: 'inheritance-tax',
    title: '상속세',
    category: '증여/상속 계산',
    fields: [
      { type: 'number', key: 'totalValue', label: '상속재산총액 (원)', required: true, placeholder: '예: 1000000000' },
      { type: 'number', key: 'heirs', label: '상속인 수', required: true, placeholder: '예: 2' },
      { type: 'toggle', key: 'hasSpouse', label: '배우자 있음', required: true, options: ['예', '아니오'] }
    ],
    compute: computeInheritanceTax
  },
  {
    id: 'inheritance-share',
    title: '상속지분 계산',
    category: '증여/상속 계산',
    fields: [
      { type: 'number', key: 'heirs', label: '상속인 수', required: true, placeholder: '예: 3' },
      { type: 'toggle', key: 'spouseIncluded', label: '배우자 포함', required: true, options: ['예', '아니오'] }
    ],
    compute: computeInheritanceShare
  },
  
  // [6] 투자/수익 계산
  {
    id: 'rental-yield',
    title: '임대수익률',
    category: '투자/수익 계산',
    fields: [
      { type: 'number', key: 'deposit', label: '보증금 (원)', required: true, placeholder: '예: 300000000' },
      { type: 'number', key: 'rent', label: '월세 (원)', required: true, placeholder: '예: 1000000' },
      { type: 'number', key: 'price', label: '매입가/투자금 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'number', key: 'vacancy', label: '공실률 (%)', required: false, placeholder: '기본 0', defaultValue: 0 }
    ],
    compute: computeRentalYield
  },
  {
    id: 'deemed-rental',
    title: '간주임대료',
    category: '투자/수익 계산',
    fields: [
      { type: 'number', key: 'deposit', label: '보증금 (원)', required: true, placeholder: '예: 300000000' },
      { type: 'number', key: 'rate', label: '적용이율 (%)', required: false, placeholder: '기본 3.0', defaultValue: 3.0 }
    ],
    compute: computeDeemedRental
  },
  {
    id: 'optimal-price',
    title: '적정매수가',
    category: '투자/수익 계산',
    fields: [
      { type: 'number', key: 'targetYield', label: '목표수익률 (%)', required: true, placeholder: '예: 5.0' },
      { type: 'number', key: 'rent', label: '월 순임대수익 (원)', required: true, placeholder: '비용 제외 후' }
    ],
    compute: computeOptimalPrice
  },
  
  // [7] 금융계산 도구
  {
    id: 'loan-calculation',
    title: '대출이자/상환',
    category: '금융계산 도구',
    fields: [
      { type: 'number', key: 'loanAmount', label: '대출금액 (원)', required: true, placeholder: '예: 300000000' },
      { type: 'number', key: 'annualRate', label: '연이율 (%)', required: true, placeholder: '예: 3.5' },
      { type: 'number', key: 'years', label: '상환기간 (년)', required: true, placeholder: '예: 20' },
      { type: 'select', key: 'payType', label: '상환방식', required: true, options: ['원리금균등', '만기일시'] }
    ],
    compute: computeLoanCalculation
  },
  {
    id: 'dti-dsr',
    title: 'DTI/DSR/LTV/RTI',
    category: '금융계산 도구',
    fields: [
      { type: 'number', key: 'annualIncome', label: '연소득 (원)', required: true, placeholder: '예: 50000000' },
      { type: 'number', key: 'annualDebtPay', label: '연간 원리금 상환액 (원)', required: true, placeholder: '예: 15000000' },
      { type: 'number', key: 'housePrice', label: '주택가격 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'number', key: 'loanAmount', label: '대출금액 (원)', required: true, placeholder: '예: 300000000' },
      { type: 'number', key: 'annualRentIncome', label: '연간 임대수입 (원, RTI용)', required: false, placeholder: '선택' }
    ],
    compute: computeDTIDSR
  },
  {
    id: 'deposit-insurance',
    title: '전세보증보험/월세조정',
    category: '금융계산 도구',
    fields: [
      { type: 'number', key: 'deposit', label: '보증금 (원)', required: true, placeholder: '예: 300000000' },
      { type: 'number', key: 'rent', label: '월세 (원)', required: true, placeholder: '예: 1000000' },
      { type: 'number', key: 'convertRate', label: '전월세전환율 (%)', required: false, placeholder: '기본 4.0', defaultValue: 4.0 }
    ],
    compute: computeDepositInsurance
  },
  
  // [8] 단위·환산 도구
  {
    id: 'area-conversion',
    title: '평↔m² 환산',
    category: '단위·환산 도구',
    fields: [
      { type: 'number', key: 'value', label: '값', required: true, placeholder: '예: 33' },
      { type: 'select', key: 'direction', label: '환산 방향', required: true, options: ['평→m²', 'm²→평'] }
    ],
    compute: computeAreaConversion
  },
  {
    id: 'unit-price',
    title: '단위가격',
    category: '단위·환산 도구',
    fields: [
      { type: 'number', key: 'total', label: '총가격 (원)', required: true, placeholder: '예: 500000000' },
      { type: 'number', key: 'area', label: '면적', required: true, placeholder: '예: 33' },
      { type: 'select', key: 'unit', label: '단위', required: true, options: ['평당', 'm²당'] }
    ],
    compute: computeUnitPrice
  },
  {
    id: 'far',
    title: '건폐율·용적률',
    category: '단위·환산 도구',
    fields: [
      { type: 'number', key: 'landArea', label: '대지면적 (m²)', required: true, placeholder: '예: 200' },
      { type: 'number', key: 'buildingArea', label: '건축면적 (m²)', required: true, placeholder: '예: 100' },
      { type: 'number', key: 'totalFloorArea', label: '연면적 (m²)', required: true, placeholder: '예: 300' }
    ],
    compute: computeFAR
  },
  
  // [9] 기타 편의 계산
  {
    id: 'overdue-rent',
    title: '연체임대료이자',
    category: '기타 편의 계산',
    fields: [
      { type: 'number', key: 'unpaid', label: '미납금액 (원)', required: true, placeholder: '예: 1000000' },
      { type: 'number', key: 'days', label: '연체일수', required: true, placeholder: '예: 30' },
      { type: 'number', key: 'annualRate', label: '연이율 (%)', required: false, placeholder: '기본 12', defaultValue: 12 }
    ],
    compute: computeOverdueRent
  },
  {
    id: 'eviction-cost',
    title: '명도비용',
    category: '기타 편의 계산',
    fields: [
      { type: 'number', key: 'base', label: '기본비용 (원)', required: true, placeholder: '예: 5000000' },
      { type: 'number', key: 'months', label: '지연개월', required: true, placeholder: '예: 3' },
      { type: 'number', key: 'monthlyPenalty', label: '월 지연비용 (원)', required: true, placeholder: '예: 500000' }
    ],
    compute: computeEvictionCost
  },
  {
    id: 'good-landlord',
    title: '착한임대인 혜택',
    category: '기타 편의 계산',
    fields: [
      { type: 'number', key: 'rentBefore', label: '인하 전 월세 (원)', required: true, placeholder: '예: 1000000' },
      { type: 'number', key: 'rentAfter', label: '인하 후 월세 (원)', required: true, placeholder: '예: 800000' },
      { type: 'number', key: 'months', label: '적용개월', required: true, placeholder: '예: 12' }
    ],
    compute: computeGoodLandlord
  }
]

// 소분류 ID로 스키마 찾기
export const getSchemaById = (id) => {
  return calculatorSchemas.find(schema => schema.id === id)
}

// 카테고리별 스키마 찾기
export const getSchemasByCategory = (category) => {
  return calculatorSchemas.filter(schema => schema.category === category)
}



