import React, { useState, useRef, useEffect } from 'react'
import { getCalculatorDefinition } from '../lib/calculators/definitions'
import { getLegalBasis } from '../data/legalBasis'
import './Chatbot.css'

const Chatbot = ({ selectedMainCategory, selectedSubCategory, calculationResult }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `안녕하세요! AI부동산계산입니다. ${selectedSubCategory} 관련 질문이 있으시면 언제든 물어보세요! 🏠`,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const prevSubCategoryRef = useRef(selectedSubCategory)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (prevSubCategoryRef.current !== selectedSubCategory) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${selectedSubCategory} 계산을 도와드릴게요. 왼쪽 폼에서 계산하시거나 질문해주세요!`,
        timestamp: new Date()
      }])
      prevSubCategoryRef.current = selectedSubCategory
    }
  }, [selectedSubCategory])

  // 계산 결과가 변경되면 챗에 자동 추가
  useEffect(() => {
    if (calculationResult) {
      const resultMessage = formatCalculationResult(calculationResult, selectedSubCategory)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: resultMessage,
        timestamp: new Date()
      }])
    }
  }, [calculationResult, selectedSubCategory])

  const formatCalculationResult = (result, category) => {
    if (result.error) {
      return `❌ ${result.error}`
    }

    let message = `📊 ${result.title || category} 계산 결과\n\n`
    
    // 결과 요약
    if (result.results && result.results.length > 0) {
      result.results.forEach(item => {
        message += `${item.label}: ${item.value}${item.unit || ''}\n`
      })
      message += `\n`
    }

    if (result.summary) {
      message += `${result.summary}\n\n`
    }

    // 법령 근거 정보
    if (result.calculatorId) {
      const definition = getCalculatorDefinition(result.calculatorId)
      if (definition && definition.legalBasis && definition.legalBasis.length > 0) {
        const legalBasis = definition.legalBasis[0]
        message += `**적용 법령**\n`
        message += `법령명: ${legalBasis.name}\n`
        message += `시행일: ${legalBasis.effectiveFrom}\n`
        if (legalBasis.sourceUrl) {
          message += `출처: ${legalBasis.sourceUrl}\n`
        }
        message += `\n`
      }

      if (definition && definition.formulaSummary) {
        message += `**계산 공식 요약**\n`
        message += `${definition.formulaSummary}\n\n`
      }
    }
    
    message += `※ 본 결과는 참고용 계산이며 실제 세금과 다를 수 있습니다.`
    
    return message
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const botResponse = generateResponse(userMessage.content, selectedSubCategory)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botResponse,
        timestamp: new Date()
      }])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const generateResponse = (userInput, category) => {
    const lowerInput = userInput.toLowerCase()
    
    // 법령 근거 키워드 감지
    const legalKeywords = ['근거', '법령', '시행일', '공식', '출처', '법적', '법률', '조문', '별표', '근거법령']
    const hasLegalKeyword = legalKeywords.some(keyword => lowerInput.includes(keyword))
    
    if (hasLegalKeyword) {
      const legalBasisData = getLegalBasis(selectedMainCategory, selectedSubCategory)
      if (legalBasisData) {
        let response = `**${legalBasisData.title}**\n\n`
        response += `**요약**\n${legalBasisData.summary}\n\n`
        response += `**시행일**\n${legalBasisData.effectiveDate}\n\n`
        response += `**근거(조문/별표)**\n${legalBasisData.basis}\n\n`
        response += `**공식/계산 로직**\n${legalBasisData.formula}\n\n`
        if (legalBasisData.sources && legalBasisData.sources.length > 0) {
          response += `**출처**\n`
          legalBasisData.sources.forEach((source, index) => {
            response += `${index + 1}. ${source}\n`
          })
        }
        return response
      }
    }
    
    if (lowerInput.includes('안녕') || lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `안녕하세요! 😊 ${category} 관련 질문이 있으시면 언제든 물어보세요!`
    }
    
    if (lowerInput.includes('이름') || lowerInput.includes('누구') || lowerInput.includes('소개')) {
      return `저는 AI부동산계산입니다! 🤖 ${category}를 포함한 부동산 세금 계산 질문에 답변해드리기 위해 여기 있습니다.`
    }
    
    if (lowerInput.includes('도움') || lowerInput.includes('help') || lowerInput.includes('어떻게')) {
      return `저는 ${category}를 포함한 다양한 부동산 세금 계산 질문에 답변할 수 있습니다! 💡 왼쪽 폼에서 계산하시거나 질문해주세요.`
    }
    
    if (lowerInput.includes('감사') || lowerInput.includes('고마워')) {
      return '천만에요! 😄 다른 도움이 필요하시면 언제든 말씀해주세요.'
    }
    
    return `"${userInput}"에 대한 ${category} 관련 답변을 준비 중입니다. 더 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다. 💬`
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>AI 부동산 계산</h2>
        <div className="status">{selectedSubCategory} 관련 질문이 있으시면 언제든 물어보세요</div>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {message.content.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div className="message-time">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-input-form" onSubmit={handleSend}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="💬 메시지를 입력하세요..."
          className="chatbot-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!input.trim() || isLoading}
        >
          전송
        </button>
      </form>
    </div>
  )
}

export default Chatbot
