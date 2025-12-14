/**
 * 계산 엔진 (Rule Engine)
 * CalculatorDefinition을 기반으로 계산 수행
 */

import { getCalculatorDefinition } from './definitions'
import { computeBrokerageFee } from './compute/brokerageFee'
import { computeStampTax } from './compute/stampTax'
import { formatCurrency } from './utils'

/**
 * 입력값 검증
 */
const validateInputs = (definition, inputs) => {
  const errors = []
  
  definition.inputs.forEach(field => {
    if (field.required && !inputs[field.key]) {
      errors.push(`${field.label}을(를) 입력해주세요.`)
    }
  })
  
  return errors
}

/**
 * 계산 수행
 */
const executeCalculation = (definition, inputs) => {
  // 기존 compute 함수 호출
  let result = {}
  
  if (definition.id === 'brokerage-fee-house-sale') {
    result = computeBrokerageFee(inputs)
  } else if (definition.id === 'stamp-tax-contract') {
    result = computeStampTax(inputs)
  }
  
  return result
}

/**
 * breakdown 생성
 */
const generateBreakdown = (definition, inputs, result) => {
  const breakdown = []
  
  if (definition.outputSpec && definition.outputSpec.breakdown) {
    definition.outputSpec.breakdown.forEach((step, index) => {
      let value = ''
      
      if (step.value === 'amount') {
        value = formatCurrency(inputs.amount || 0)
      } else if (step.value === 'rate') {
        value = result.feeRate || result.taxRate || '-'
      } else if (step.value === 'calculated') {
        value = result.brokerageFee || result.taxAmount || '-'
      }
      
      breakdown.push({
        step: step.step || index + 1,
        name: step.name,
        formula: step.formula,
        value: value
      })
    })
  }
  
  return breakdown
}

/**
 * 결과 구조화
 */
const formatResults = (definition, inputs, rawResult) => {
  const results = []
  
  if (definition.outputSpec && definition.outputSpec.results) {
    definition.outputSpec.results.forEach(spec => {
      const value = rawResult[spec.key]
      if (value !== undefined) {
        results.push({
          label: spec.label,
          value: spec.format === 'currency' ? formatCurrency(value) : value,
          unit: spec.unit,
          explain: spec.explain || ''
        })
      }
    })
  }
  
  return results
}

/**
 * 공유 URL 생성
 */
const generateShareUrl = (definition, inputs) => {
  const params = new URLSearchParams()
  params.set('calculatorId', definition.id)
  
  // inputs를 base64url 인코딩
  const inputsJson = JSON.stringify(inputs)
  const inputsEncoded = btoa(inputsJson).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  params.set('inputs', inputsEncoded)
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

/**
 * 메인 calculate 함수
 * @param {string} calculatorId - 계산기 ID
 * @param {object} inputs - 입력값
 * @returns {object} 구조화된 계산 결과
 */
export const calculate = (calculatorId, inputs) => {
  // 정의 가져오기
  const definition = getCalculatorDefinition(calculatorId)
  
  if (!definition) {
    throw new Error(`계산기 정의를 찾을 수 없습니다: ${calculatorId}`)
  }
  
  // 입력값 검증
  const validationErrors = validateInputs(definition, inputs)
  if (validationErrors.length > 0) {
    return {
      error: validationErrors.join(', ')
    }
  }
  
  // 계산 수행
  const rawResult = executeCalculation(definition, inputs)
  
  // 결과 구조화
  const results = formatResults(definition, inputs, rawResult)
  const breakdown = generateBreakdown(definition, inputs, rawResult)
  
  // 공유 URL 생성
  const shareUrl = generateShareUrl(definition, inputs)
  
  // 최종 결과 반환
  return {
    calculatorId: definition.id,
    title: definition.title,
    categoryMajor: definition.categoryMajor,
    categoryMinor: definition.categoryMinor,
    inputs: inputs,
    results: results,
    breakdown: breakdown,
    legalBasis: definition.legalBasis || [],
    disclaimers: definition.disclaimers || [],
    summary: rawResult.summary || '',
    share: {
      shareUrl: shareUrl,
      imageReady: true
    },
    version: definition.version,
    updatedAt: definition.updatedAt,
    // 기존 호환성을 위한 필드
    ...rawResult
  }
}

/**
 * URL에서 상태 복원
 */
export const restoreFromUrl = () => {
  const params = new URLSearchParams(window.location.search)
  const calculatorId = params.get('calculatorId')
  const inputsEncoded = params.get('inputs')
  
  if (!calculatorId || !inputsEncoded) {
    return null
  }
  
  try {
    const inputsJson = atob(inputsEncoded.replace(/-/g, '+').replace(/_/g, '/'))
    const inputs = JSON.parse(inputsJson)
    
    return {
      calculatorId,
      inputs
    }
  } catch (error) {
    console.error('URL 복원 실패:', error)
    return null
  }
}

