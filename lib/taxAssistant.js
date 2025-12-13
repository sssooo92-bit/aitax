function nowIso() {
  return new Date().toISOString();
}

function pickKoreanTaxTemplate(userText) {
  const t = (userText || '').toLowerCase();

  if (t.includes('부가') || t.includes('vat') || t.includes('부가세')) {
    return [
      '부가가치세(부가세) 관련해서 먼저 몇 가지를 확인해야 정확해요.',
      '',
      `1) 사업자 유형(일반/간이/면세)
2) 거래 종류(재화/용역, 국내/해외)
3) 과세기간(예: 1기/2기)과 매출·매입 규모
4) 증빙(세금계산서/현금영수증/카드매출 등)`,
      '',
      '상황을 알려주시면 신고/납부 흐름과 주의사항을 간단히 정리해드릴게요. (법률·세무 자문이 아니라 참고용 안내예요)'
    ].join('\n');
  }

  if (t.includes('연말정산') || t.includes('근로') || t.includes('월급')) {
    return [
      '연말정산/근로소득 쪽이네요. 아래를 알려주시면 체크리스트로 계산 흐름을 잡아드릴게요.',
      '',
      `- 총급여(대략)
- 부양가족/자녀
- 주택 관련(월세/전세대출/주담대)
- 의료/교육/기부/보험료 지출 여부
- 신용카드 등 사용액(대략)`,
      '',
      '원하시면 “어떤 공제부터 확인하면 좋은지” 우선순위도 같이 정리해드릴게요.'
    ].join('\n');
  }

  if (t.includes('양도') || t.includes('집') || t.includes('부동산') || t.includes('주식')) {
    return [
      '양도소득세(부동산/주식) 가능성이 있어요. 정확도에 필요한 핵심 질문만 먼저 드릴게요.',
      '',
      `1) 자산 종류(주택/토지/주식 등)
2) 취득일·양도일
3) 취득가·양도가(대략)
4) 보유기간/거주기간(주택)
5) 1세대 1주택 여부(주택)
6) 필요경비 증빙 가능 여부`,
      '',
      '정보 주시면 “과세/비과세 가능성”과 “대략적인 계산 구조”부터 안내할게요. (참고용)'
    ].join('\n');
  }

  return [
    '좋아요. 세금 질문은 “누가/무엇을/언제/얼마나” 4가지만 잡히면 정확도가 확 올라가요.',
    '',
    `아래 중 해당되는 걸 골라서 상황을 적어주세요:
- 근로소득(연말정산)
- 사업소득(부가세/종소세)
- 양도(부동산/주식)
- 상속·증여
- 기타(취득세/지방세 등)`,
    '',
    '가능하면 숫자는 대략이라도 좋아요. (법률·세무 자문이 아니라 참고용 안내입니다)'
  ].join('\n');
}

export function demoTaxReply({ messages }) {
  const lastUser = [...(messages || [])].reverse().find((m) => m.role === 'user');
  const userText = lastUser?.content || '';

  return {
    id: `demo_${Date.now()}`,
    createdAt: nowIso(),
    mode: 'demo',
    reply: pickKoreanTaxTemplate(userText)
  };
}
