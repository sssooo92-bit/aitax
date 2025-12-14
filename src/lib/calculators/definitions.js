/**
 * CalculatorDefinition 스키마
 * 각 계산기의 정의, 법 근거, 공식 등을 포함
 */

/**
 * LegalBasis 스키마
 */
export const LegalBasisSchema = {
  name: '', // 예: "공인중개사법 시행규칙 별표1"
  effectiveFrom: '', // YYYY-MM-DD
  note: '', // ex: "2021-10-19 이후 체결 계약부터 적용"
  sourceUrl: '', // 공식 링크
  citationText: '' // 짧은 근거 문장
}

/**
 * 중개수수료 계산기 정의 (주택 매매)
 */
export const brokerageFeeHouseSaleDefinition = {
  id: 'brokerage-fee-house-sale',
  title: '중개수수료',
  categoryMajor: '거래비용 계산',
  categoryMinor: '중개수수료',
  inputs: [
    { type: 'select', key: 'dealType', label: '거래 유형', required: true, options: ['매매', '전세', '월세'] },
    { type: 'select', key: 'propertyType', label: '부동산 종류', required: true, options: ['주택', '오피스텔', '상가', '토지'] },
    { type: 'number', key: 'amount', label: '거래금액 (원)', required: true, placeholder: '예: 500000000' }
  ],
  formulaSpec: {
    type: 'progressive', // 구간별 누진
    rules: [
      { range: [0, 50000000], rate: 0.006, description: '5천만원 이하: 0.6%' },
      { range: [50000000, 200000000], rate: 0.005, description: '5천만원 초과 ~ 2억원 이하: 0.5%' },
      { range: [200000000, 900000000], rate: 0.004, description: '2억원 초과 ~ 9억원 이하: 0.4%' },
      { range: [900000000, Infinity], rate: 0.009, description: '9억원 초과: 0.9%' }
    ],
    specialCases: {
      '전세': { rate: 0.002, description: '전세: 0.2%' },
      '월세': { rate: 0.0005, description: '월세: 0.05%' }
    }
  },
  legalBasis: [
    {
      name: '공인중개사법 시행규칙 제20조 및 별표 1',
      effectiveFrom: '2021-10-19',
      note: '2021년 10월 개정으로 중저가 주택 구간 요율이 인하되었습니다',
      sourceUrl: 'https://www.law.go.kr',
      citationText: '주택 매매·임대차 시 중개보수는 거래금액 구간별 상한요율 내에서만 받을 수 있습니다'
    }
  ],
  formulaSummary: '중개수수료 = 거래금액 × 적용요율\n(단, 구간별 상한요율 초과 불가)',
  description: '주택 매매·임대차 시 중개보수는 거래금액 구간별 상한요율 내에서만 받을 수 있습니다. 2021년 10월 개정으로 중저가 주택 구간 요율이 인하되었습니다.',
  outputSpec: {
    results: [
      { key: 'brokerageFee', label: '중개수수료', unit: '원', format: 'currency' },
      { key: 'feeRate', label: '적용 요율', unit: '%', format: 'percentage' }
    ],
    breakdown: [
      { step: 1, name: '거래금액 확인', formula: '입력값', value: 'amount' },
      { step: 2, name: '거래유형별 요율 적용', formula: 'dealType별 요율', value: 'rate' },
      { step: 3, name: '구간별 누진 계산', formula: '구간별 금액 × 요율', value: 'calculated' }
    ]
  },
  disclaimers: [
    '본 계산 결과는 참고용이며, 실제 중개수수료는 계약 당사자 간 협의에 따라 달라질 수 있습니다.',
    '2021년 10월 19일 이후 체결 계약부터 적용되는 요율 기준입니다.',
    '실제 거래 시에는 공인중개사와 상담하여 정확한 수수료를 확인하시기 바랍니다.'
  ],
  version: '1.0.0',
  updatedAt: '2024-01-15'
}

/**
 * 인지세 계산기 정의 (계약서)
 */
export const stampTaxContractDefinition = {
  id: 'stamp-tax-contract',
  title: '인지세',
  categoryMajor: '거래비용 계산',
  categoryMinor: '인지세 · 채권 · 부가세',
  inputs: [
    { type: 'select', key: 'item', label: '항목 선택', required: true, options: ['인지세', '국민주택채권', '부가세(간이)'] },
    { type: 'number', key: 'amount', label: '계약금액 (원)', required: true, placeholder: '예: 500000000' }
  ],
  formulaSpec: {
    type: 'progressive', // 구간별 누진
    rules: [
      { range: [0, 10000000], amount: 0, description: '1천만원 이하: 면제' },
      { range: [10000000, 30000000], amount: 20000, description: '1천만원 초과 ~ 3천만원: 2만원' },
      { range: [30000000, 50000000], amount: 50000, description: '3천만원 초과 ~ 5천만원: 5만원' },
      { range: [50000000, 100000000], amount: 100000, description: '5천만원 초과 ~ 1억원: 10만원' },
      { range: [100000000, 500000000], amount: 300000, description: '1억원 초과 ~ 5억원: 30만원' },
      { range: [500000000, 1000000000], amount: 500000, description: '5억원 초과 ~ 10억원: 50만원' },
      { range: [1000000000, Infinity], amount: 1000000, description: '10억원 초과: 100만원' }
    ],
    specialCases: {
      '국민주택채권': { rate: 0.005, description: '국민주택채권: 0.5%' },
      '부가세(간이)': { rate: 0.1, description: '부가세(간이): 10%' }
    }
  },
  legalBasis: [
    {
      name: '인지세법 제3조',
      effectiveFrom: '2014-01-01',
      note: '부동산 매매·임대차 계약서 작성 시 계약금액에 따라 정액 인지세가 부과됩니다. 전자계약도 동일한 기준 적용',
      sourceUrl: 'https://www.law.go.kr',
      citationText: '부동산 매매·임대차 계약서 작성 시 계약금액에 따라 정액 인지세가 부과됩니다'
    }
  ],
  formulaSummary: '인지세 = 계약금액 구간별 정액세\n예)\n1천만~3천만: 2만원\n3천만~5천만: 4만원\n5천만~1억: 7만원\n1억~10억: 15만원\n10억 초과: 35만원',
  description: '부동산 매매·임대차 계약서 작성 시 계약금액에 따라 정액 인지세가 부과됩니다. 전자계약도 동일한 기준 적용',
  outputSpec: {
    results: [
      { key: 'taxAmount', label: '인지세액', unit: '원', format: 'currency' },
      { key: 'taxRate', label: '적용 기준', unit: '', format: 'text' }
    ],
    breakdown: [
      { step: 1, name: '계약금액 확인', formula: '입력값', value: 'amount' },
      { step: 2, name: '구간별 금액 적용', formula: '금액 구간에 따른 고정액', value: 'calculated' }
    ]
  },
  disclaimers: [
    '본 계산 결과는 참고용이며, 실제 인지세는 계약서 종류와 금액에 따라 달라질 수 있습니다.',
    '1천만원 이하 계약은 인지세가 면제됩니다.',
    '실제 납부 시에는 세무서 또는 관할 기관에 문의하시기 바랍니다.'
  ],
  version: '1.0.0',
  updatedAt: '2024-01-15'
}

/**
 * 모든 계산기 정의를 모아놓은 맵
 */
export const calculatorDefinitions = {
  'brokerage-fee-house-sale': brokerageFeeHouseSaleDefinition,
  'stamp-tax-contract': stampTaxContractDefinition
}

/**
 * 계산기 ID로 정의 가져오기
 */
export const getCalculatorDefinition = (id) => {
  return calculatorDefinitions[id]
}

/**
 * 모든 정의 목록 가져오기
 */
export const getAllDefinitions = () => {
  return Object.values(calculatorDefinitions)
}

