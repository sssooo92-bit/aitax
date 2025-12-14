/**
 * 법령 근거 데이터셋
 * 대분류/소분류 키 기반으로 조회 가능
 */

export interface LegalBasisItem {
  major: string
  minor: string
  title: string
  effectiveDate: string
  basis: string
  formula: string
  summary: string
  sources: string[]
}

export const legalBasis: LegalBasisItem[] = [
  {
    major: '거래비용 계산',
    minor: '중개수수료',
    title: '중개보수(중개수수료) 산정 근거',
    effectiveDate: '2024-07-10 (공인중개사법 시행규칙 기준)',
    basis: '공인중개사법 시행규칙 제20조 및 [별표 1] 주택 중개보수 상한요율, [별표 2] 오피스텔 중개보수 요율. 실제 적용 요율은 시·도 조례 한도 내에서 협의.',
    formula: '중개보수 = 거래금액 × (상한요율) (단, 구간별 한도액 존재 시 한도액을 초과할 수 없음).',
    summary: '거래금액 구간별 상한요율/한도액을 적용해 중개보수를 산정한다(조례 한도 내 협의). 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/LSW/lumLsLinkPop.do?lspttninfSeq=106773',
      'https://www.law.go.kr/LSW/lsBylInfoPLinkR.do?bylBrNo=00&bylCls=BE&bylNo=0001&lsNm=%EA%B3%B5%EC%9D%B8%EC%A4%91%EA%B0%9C%EC%82%AC%EB%B2%95+%EC%8B%9C%ED%96%89%EA%B7%9C%EC%B9%99',
      'https://www.law.go.kr/lsBylInfoPLinkR.do?bylBrNo=00&bylCls=BE&bylNo=0002&lsNm=%EA%B3%B5%EC%9D%B8%EC%A4%91%EA%B0%9C%EC%82%AC%EB%B2%95+%EC%8B%9C%ED%96%89%EA%B7%9C%EC%B9%99'
    ]
  },
  {
    major: '거래비용 계산',
    minor: '법무사/등기비용',
    title: '등기 관련 비용(등록면허세/등기절차) 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-01-31 (부동산등기법)',
    basis: '부동산등기법(등기 절차 일반) + 지방세법(등록면허세: 등기 시 과세되는 지방세). 법무사 보수는 법령 고정값이 아니라 사건·지역·사무소별 상이(견적/관행 영역).',
    formula: '등록면허세 = 과세표준 × 세율(등기 원인/유형에 따라 상이) + (지방교육세 등 부가세목이 있을 수 있음). 법무사비/인지대/증지대는 항목별 합산.',
    summary: '등기 자체는 부동산등기법, 등기 시 내는 등록면허세는 지방세법 근거로 계산(세율/부가세목은 유형별). 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/LSW/lsInfoP.do?lsId=001697',
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123'
    ]
  },
  {
    major: '거래비용 계산',
    minor: '인지세 · 채권 · 부가세',
    title: '인지세/국민주택채권/부가가치세 근거',
    effectiveDate: '2025-10-01 (인지세법), 2025-05-27 (주택도시기금법), 2025-07-01 (부가가치세법)',
    basis: '인지세는 인지세법(과세문서 작성 시 납부). 국민주택채권 발행·근거는 주택도시기금법(국민주택채권 발행 등). 부가가치세는 부가가치세법(과세대상 거래에 해당 시 적용).',
    formula: '인지세 = 문서(계약서 등) \'기재금액 구간\'에 따른 세액(정액/구간표). 국민주택채권 = 매입대상/등기유형/지역 등에 따른 매입액(구간/요율표 기반). 부가세 = 공급가액 × 10%(일반 기준, 면세/영세율 등 예외 존재).',
    summary: '계약서·등기·거래 성격에 따라 인지세/채권매입/부가세가 각각 별도 근거로 발생할 수 있어 \'해당 여부\'를 먼저 판정해야 한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/LSW/lsStmdInfoP.do?lsiSeq=5857',
      'https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&lsId=001571',
      'https://www.law.go.kr/LSW/LsiJoLinkP.do?docType=JO&joNo=000300000&languageType=KO&lsNm=%EC%A3%BC%ED%83%9D%EB%8F%84%EC%8B%9C%EA%B8%88%EA%B8%88%EB%B2%95&paras=1'
    ]
  },
  {
    major: '취득세 계산',
    minor: '주택 취득세',
    title: '취득세(지방세) 산정 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-10-01 (지방세특례제한법)',
    basis: '취득세는 지방세법 근거. 감면(생애최초 등)·특례는 지방세특례제한법 근거. 조정대상지역/주택수/감면요건 등은 해당 법령 및 하위규정·고시/조례/행정해석에 따라 판정.',
    formula: '취득세 = 과세표준(통상 취득가액) × 세율(주택/비주택/주택수/조정지역/감면 등에 따라 \'구간·유형별\'). 감면 적용 시 (산출세액 - 감면액).',
    summary: '취득세는 \'무엇을/몇 채를/어디서/어떤 자격으로\' 취득하느냐에 따라 세율·감면이 크게 달라져 옵션 입력이 필수다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011178'
    ]
  },
  {
    major: '취득세 계산',
    minor: '오피스텔 취득세',
    title: '취득세(지방세) 산정 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-10-01 (지방세특례제한법)',
    basis: '취득세는 지방세법 근거. 감면(생애최초 등)·특례는 지방세특례제한법 근거. 조정대상지역/주택수/감면요건 등은 해당 법령 및 하위규정·고시/조례/행정해석에 따라 판정.',
    formula: '취득세 = 과세표준(통상 취득가액) × 세율(주택/비주택/주택수/조정지역/감면 등에 따라 \'구간·유형별\'). 감면 적용 시 (산출세액 - 감면액).',
    summary: '취득세는 \'무엇을/몇 채를/어디서/어떤 자격으로\' 취득하느냐에 따라 세율·감면이 크게 달라져 옵션 입력이 필수다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011178'
    ]
  },
  {
    major: '취득세 계산',
    minor: '상가·토지 취득세',
    title: '취득세(지방세) 산정 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-10-01 (지방세특례제한법)',
    basis: '취득세는 지방세법 근거. 감면(생애최초 등)·특례는 지방세특례제한법 근거. 조정대상지역/주택수/감면요건 등은 해당 법령 및 하위규정·고시/조례/행정해석에 따라 판정.',
    formula: '취득세 = 과세표준(통상 취득가액) × 세율(주택/비주택/주택수/조정지역/감면 등에 따라 \'구간·유형별\'). 감면 적용 시 (산출세액 - 감면액).',
    summary: '취득세는 \'무엇을/몇 채를/어디서/어떤 자격으로\' 취득하느냐에 따라 세율·감면이 크게 달라져 옵션 입력이 필수다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011178'
    ]
  },
  {
    major: '취득세 계산',
    minor: '다주택 취득세',
    title: '취득세(지방세) 산정 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-10-01 (지방세특례제한법)',
    basis: '취득세는 지방세법 근거. 감면(생애최초 등)·특례는 지방세특례제한법 근거. 조정대상지역/주택수/감면요건 등은 해당 법령 및 하위규정·고시/조례/행정해석에 따라 판정.',
    formula: '취득세 = 과세표준(통상 취득가액) × 세율(주택/비주택/주택수/조정지역/감면 등에 따라 \'구간·유형별\'). 감면 적용 시 (산출세액 - 감면액).',
    summary: '취득세는 \'무엇을/몇 채를/어디서/어떤 자격으로\' 취득하느냐에 따라 세율·감면이 크게 달라져 옵션 입력이 필수다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011178'
    ]
  },
  {
    major: '취득세 계산',
    minor: '생애최초 취득세',
    title: '취득세(지방세) 산정 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-10-01 (지방세특례제한법)',
    basis: '취득세는 지방세법 근거. 감면(생애최초 등)·특례는 지방세특례제한법 근거. 조정대상지역/주택수/감면요건 등은 해당 법령 및 하위규정·고시/조례/행정해석에 따라 판정.',
    formula: '취득세 = 과세표준(통상 취득가액) × 세율(주택/비주택/주택수/조정지역/감면 등에 따라 \'구간·유형별\'). 감면 적용 시 (산출세액 - 감면액).',
    summary: '취득세는 \'무엇을/몇 채를/어디서/어떤 자격으로\' 취득하느냐에 따라 세율·감면이 크게 달라져 옵션 입력이 필수다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011178'
    ]
  },
  {
    major: '취득세 계산',
    minor: '취득세 세부옵션',
    title: '취득세(지방세) 산정 근거',
    effectiveDate: '2025-10-01 (지방세법), 2025-10-01 (지방세특례제한법)',
    basis: '취득세는 지방세법 근거. 감면(생애최초 등)·특례는 지방세특례제한법 근거. 조정대상지역/주택수/감면요건 등은 해당 법령 및 하위규정·고시/조례/행정해석에 따라 판정.',
    formula: '취득세 = 과세표준(통상 취득가액) × 세율(주택/비주택/주택수/조정지역/감면 등에 따라 \'구간·유형별\'). 감면 적용 시 (산출세액 - 감면액).',
    summary: '취득세는 \'무엇을/몇 채를/어디서/어떤 자격으로\' 취득하느냐에 따라 세율·감면이 크게 달라져 옵션 입력이 필수다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?ancYnChk=0&lsId=011178'
    ]
  },
  {
    major: '보유세 계산',
    minor: '재산세 계산',
    title: '보유세(재산세·종부세) 근거',
    effectiveDate: '2025-10-01 (지방세법: 재산세), 2025-03-14 (종합부동산세법)',
    basis: '재산세는 지방세법(지방세). 종합부동산세는 종합부동산세법(국세). 과세표준은 공시가격, 공정시장가액비율, 공제/세율표 등 \'현행 기준\'에 따라 산정.',
    formula: '재산세 = 과세표준 × 세율(구간표) ± 감면/특례. 종부세 = (과세표준 - 공제) × 세율(구간표) ± 세부담상한/공제.',
    summary: '보유세는 재산세(지방) + 종부세(국세)로 나뉘며, 공시가격·공제·세율표가 매년 바뀔 수 있어 \'기준년도\'가 중요하다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=129535'
    ]
  },
  {
    major: '보유세 계산',
    minor: '종합부동산세',
    title: '보유세(재산세·종부세) 근거',
    effectiveDate: '2025-10-01 (지방세법: 재산세), 2025-03-14 (종합부동산세법)',
    basis: '재산세는 지방세법(지방세). 종합부동산세는 종합부동산세법(국세). 과세표준은 공시가격, 공정시장가액비율, 공제/세율표 등 \'현행 기준\'에 따라 산정.',
    formula: '재산세 = 과세표준 × 세율(구간표) ± 감면/특례. 종부세 = (과세표준 - 공제) × 세율(구간표) ± 세부담상한/공제.',
    summary: '보유세는 재산세(지방) + 종부세(국세)로 나뉘며, 공시가격·공제·세율표가 매년 바뀔 수 있어 \'기준년도\'가 중요하다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=129535'
    ]
  },
  {
    major: '보유세 계산',
    minor: '보유세 종합 계산',
    title: '보유세(재산세·종부세) 근거',
    effectiveDate: '2025-10-01 (지방세법: 재산세), 2025-03-14 (종합부동산세법)',
    basis: '재산세는 지방세법(지방세). 종합부동산세는 종합부동산세법(국세). 과세표준은 공시가격, 공정시장가액비율, 공제/세율표 등 \'현행 기준\'에 따라 산정.',
    formula: '재산세 = 과세표준 × 세율(구간표) ± 감면/특례. 종부세 = (과세표준 - 공제) × 세율(구간표) ± 세부담상한/공제.',
    summary: '보유세는 재산세(지방) + 종부세(국세)로 나뉘며, 공시가격·공제·세율표가 매년 바뀔 수 있어 \'기준년도\'가 중요하다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=129535'
    ]
  },
  {
    major: '보유세 계산',
    minor: '1주택자 보유세',
    title: '보유세(재산세·종부세) 근거',
    effectiveDate: '2025-10-01 (지방세법: 재산세), 2025-03-14 (종합부동산세법)',
    basis: '재산세는 지방세법(지방세). 종합부동산세는 종합부동산세법(국세). 과세표준은 공시가격, 공정시장가액비율, 공제/세율표 등 \'현행 기준\'에 따라 산정.',
    formula: '재산세 = 과세표준 × 세율(구간표) ± 감면/특례. 종부세 = (과세표준 - 공제) × 세율(구간표) ± 세부담상한/공제.',
    summary: '보유세는 재산세(지방) + 종부세(국세)로 나뉘며, 공시가격·공제·세율표가 매년 바뀔 수 있어 \'기준년도\'가 중요하다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=129535'
    ]
  },
  {
    major: '보유세 계산',
    minor: '다주택자 보유세',
    title: '보유세(재산세·종부세) 근거',
    effectiveDate: '2025-10-01 (지방세법: 재산세), 2025-03-14 (종합부동산세법)',
    basis: '재산세는 지방세법(지방세). 종합부동산세는 종합부동산세법(국세). 과세표준은 공시가격, 공정시장가액비율, 공제/세율표 등 \'현행 기준\'에 따라 산정.',
    formula: '재산세 = 과세표준 × 세율(구간표) ± 감면/특례. 종부세 = (과세표준 - 공제) × 세율(구간표) ± 세부담상한/공제.',
    summary: '보유세는 재산세(지방) + 종부세(국세)로 나뉘며, 공시가격·공제·세율표가 매년 바뀔 수 있어 \'기준년도\'가 중요하다. 법령 개정으로 변동 가능.',
    sources: [
      'https://law.go.kr/lsSc.do?eventGubun=060103&menuId=1&oneviewChk=on&query=%EC%A7%80%EB%B0%A9%EC%84%B8%EB%B2%95&subMenuId=23&tabMenuId=123',
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=129535'
    ]
  },
  {
    major: '양도세 계산',
    minor: '양도소득세(주택)',
    title: '양도소득세 산정 근거',
    effectiveDate: '2025-10-01 (소득세법)',
    basis: '양도소득세는 소득세법 및 하위규정(시행령/시행규칙) 근거. 1세대1주택 비과세, 다주택 중과, 장기보유특별공제 등은 요건 판정이 핵심.',
    formula: '양도차익 = 양도가액 - (취득가액 + 필요경비). 과세표준 = 양도차익 - (장기보유특별공제 등) - 기본공제. 산출세액 = 과세표준 × 세율(누진) - 누진공제.',
    summary: '양도세는 \'양도차익 계산 → 공제/비과세 요건 판정 → 누진세율 적용\' 순서로 계산한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900409527',
      'https://taxlaw.nts.go.kr/'
    ]
  },
  {
    major: '양도세 계산',
    minor: '양도소득세(상가/토지)',
    title: '양도소득세 산정 근거',
    effectiveDate: '2025-10-01 (소득세법)',
    basis: '양도소득세는 소득세법 및 하위규정(시행령/시행규칙) 근거. 1세대1주택 비과세, 다주택 중과, 장기보유특별공제 등은 요건 판정이 핵심.',
    formula: '양도차익 = 양도가액 - (취득가액 + 필요경비). 과세표준 = 양도차익 - (장기보유특별공제 등) - 기본공제. 산출세액 = 과세표준 × 세율(누진) - 누진공제.',
    summary: '양도세는 \'양도차익 계산 → 공제/비과세 요건 판정 → 누진세율 적용\' 순서로 계산한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900409527',
      'https://taxlaw.nts.go.kr/'
    ]
  },
  {
    major: '양도세 계산',
    minor: '1세대 1주택',
    title: '양도소득세 산정 근거',
    effectiveDate: '2025-10-01 (소득세법)',
    basis: '양도소득세는 소득세법 및 하위규정(시행령/시행규칙) 근거. 1세대1주택 비과세, 다주택 중과, 장기보유특별공제 등은 요건 판정이 핵심.',
    formula: '양도차익 = 양도가액 - (취득가액 + 필요경비). 과세표준 = 양도차익 - (장기보유특별공제 등) - 기본공제. 산출세액 = 과세표준 × 세율(누진) - 누진공제.',
    summary: '양도세는 \'양도차익 계산 → 공제/비과세 요건 판정 → 누진세율 적용\' 순서로 계산한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900409527',
      'https://taxlaw.nts.go.kr/'
    ]
  },
  {
    major: '양도세 계산',
    minor: '다주택 양도세',
    title: '양도소득세 산정 근거',
    effectiveDate: '2025-10-01 (소득세법)',
    basis: '양도소득세는 소득세법 및 하위규정(시행령/시행규칙) 근거. 1세대1주택 비과세, 다주택 중과, 장기보유특별공제 등은 요건 판정이 핵심.',
    formula: '양도차익 = 양도가액 - (취득가액 + 필요경비). 과세표준 = 양도차익 - (장기보유특별공제 등) - 기본공제. 산출세액 = 과세표준 × 세율(누진) - 누진공제.',
    summary: '양도세는 \'양도차익 계산 → 공제/비과세 요건 판정 → 누진세율 적용\' 순서로 계산한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900409527',
      'https://taxlaw.nts.go.kr/'
    ]
  },
  {
    major: '양도세 계산',
    minor: '장기보유특별공제',
    title: '양도소득세 산정 근거',
    effectiveDate: '2025-10-01 (소득세법)',
    basis: '양도소득세는 소득세법 및 하위규정(시행령/시행규칙) 근거. 1세대1주택 비과세, 다주택 중과, 장기보유특별공제 등은 요건 판정이 핵심.',
    formula: '양도차익 = 양도가액 - (취득가액 + 필요경비). 과세표준 = 양도차익 - (장기보유특별공제 등) - 기본공제. 산출세액 = 과세표준 × 세율(누진) - 누진공제.',
    summary: '양도세는 \'양도차익 계산 → 공제/비과세 요건 판정 → 누진세율 적용\' 순서로 계산한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900409527',
      'https://taxlaw.nts.go.kr/'
    ]
  },
  {
    major: '양도세 계산',
    minor: '양도세 절세 시뮬레이션',
    title: '양도소득세 산정 근거',
    effectiveDate: '2025-10-01 (소득세법)',
    basis: '양도소득세는 소득세법 및 하위규정(시행령/시행규칙) 근거. 1세대1주택 비과세, 다주택 중과, 장기보유특별공제 등은 요건 판정이 핵심.',
    formula: '양도차익 = 양도가액 - (취득가액 + 필요경비). 과세표준 = 양도차익 - (장기보유특별공제 등) - 기본공제. 산출세액 = 과세표준 × 세율(누진) - 누진공제.',
    summary: '양도세는 \'양도차익 계산 → 공제/비과세 요건 판정 → 누진세율 적용\' 순서로 계산한다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsLawLinkInfo.do?chrClsCd=010202&lsJoLnkSeq=900409527',
      'https://taxlaw.nts.go.kr/'
    ]
  },
  {
    major: '증여·상속 계산',
    minor: '증여세 계산',
    title: '상속세·증여세 산정 근거',
    effectiveDate: '2021-01-01 (상속세및증여세법: 현행 시행 표기 기준)',
    basis: '상속세 및 증여세는 상속세및증여세법 및 하위규정 근거. 공제(배우자/기본/일괄 등)와 과세표준 구간 누진세율이 핵심.',
    formula: '증여세: 과세표준 = (증여재산가액 - 비과세/공제 - 채무인수 등 조정). 산출세액 = 과세표준 × 세율(누진) - 누진공제. 상속세: 과세가액/공제/세율 구조 유사(상속재산 평가·공제 적용).',
    summary: '증여·상속은 공제항목이 많아서 \'관계/기간/재산종류/평가\'를 먼저 확정해야 결과가 나온다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=175026',
      'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6555&cntntsId=7782'
    ]
  },
  {
    major: '증여·상속 계산',
    minor: '상속세 계산',
    title: '상속세·증여세 산정 근거',
    effectiveDate: '2021-01-01 (상속세및증여세법: 현행 시행 표기 기준)',
    basis: '상속세 및 증여세는 상속세및증여세법 및 하위규정 근거. 공제(배우자/기본/일괄 등)와 과세표준 구간 누진세율이 핵심.',
    formula: '증여세: 과세표준 = (증여재산가액 - 비과세/공제 - 채무인수 등 조정). 산출세액 = 과세표준 × 세율(누진) - 누진공제. 상속세: 과세가액/공제/세율 구조 유사(상속재산 평가·공제 적용).',
    summary: '증여·상속은 공제항목이 많아서 \'관계/기간/재산종류/평가\'를 먼저 확정해야 결과가 나온다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=175026',
      'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6555&cntntsId=7782'
    ]
  },
  {
    major: '증여·상속 계산',
    minor: '증여·상속 비교',
    title: '상속세·증여세 산정 근거',
    effectiveDate: '2021-01-01 (상속세및증여세법: 현행 시행 표기 기준)',
    basis: '상속세 및 증여세는 상속세및증여세법 및 하위규정 근거. 공제(배우자/기본/일괄 등)와 과세표준 구간 누진세율이 핵심.',
    formula: '증여세: 과세표준 = (증여재산가액 - 비과세/공제 - 채무인수 등 조정). 산출세액 = 과세표준 × 세율(누진) - 누진공제. 상속세: 과세가액/공제/세율 구조 유사(상속재산 평가·공제 적용).',
    summary: '증여·상속은 공제항목이 많아서 \'관계/기간/재산종류/평가\'를 먼저 확정해야 결과가 나온다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=175026',
      'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6555&cntntsId=7782'
    ]
  },
  {
    major: '증여·상속 계산',
    minor: '가족 간 증여 시뮬레이션',
    title: '상속세·증여세 산정 근거',
    effectiveDate: '2021-01-01 (상속세및증여세법: 현행 시행 표기 기준)',
    basis: '상속세 및 증여세는 상속세및증여세법 및 하위규정 근거. 공제(배우자/기본/일괄 등)와 과세표준 구간 누진세율이 핵심.',
    formula: '증여세: 과세표준 = (증여재산가액 - 비과세/공제 - 채무인수 등 조정). 산출세액 = 과세표준 × 세율(누진) - 누진공제. 상속세: 과세가액/공제/세율 구조 유사(상속재산 평가·공제 적용).',
    summary: '증여·상속은 공제항목이 많아서 \'관계/기간/재산종류/평가\'를 먼저 확정해야 결과가 나온다. 법령 개정으로 변동 가능.',
    sources: [
      'https://www.law.go.kr/lsInfoP.do?lsiSeq=175026',
      'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6555&cntntsId=7782'
    ]
  }
]

/**
 * 대분류/소분류로 법령 근거 조회
 */
export const getLegalBasis = (major: string, minor: string): LegalBasisItem | null => {
  return legalBasis.find(item => item.major === major && item.minor === minor) || null
}

