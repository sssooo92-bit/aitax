'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'aitax.conversations.v1';

function uid() {
  return Math.random().toString(16).slice(2) + '_' + Date.now().toString(16);
}

function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function defaultConversation() {
  const id = uid();
  const now = new Date().toISOString();
  return {
    id,
    title: '새 대화',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: uid(),
        role: 'assistant',
        content:
          '안녕하세요, ai세금입니다.\n\n어떤 세금(연말정산/부가세/종소세/양도/상속·증여 등)을 도와드릴까요?\n가능하면 “누가/무엇을/언제/얼마나”를 함께 적어주세요.\n\n(참고용 안내이며, 최종 판단은 세무사 상담을 권장해요)'
      }
    ]
  };
}

function shortTitleFrom(text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  if (!t) return '새 대화';
  return t.length > 22 ? t.slice(0, 22) + '…' : t;
}

function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed) setState(parsed);
    } catch {
      // ignore
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}

async function postChat(messages) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function typeInto(setText, fullText, speedMs = 10) {
  setText('');
  for (let i = 1; i <= fullText.length; i++) {
    setText(fullText.slice(0, i));
    // faster for whitespace
    const ch = fullText[i - 1];
    const jitter = ch === ' ' || ch === '\n' ? 0 : Math.floor(Math.random() * 10);
    // eslint-disable-next-line no-await-in-loop
    await sleep(Math.max(0, speedMs + jitter));
  }
}

function linkify(text) {
  const s = String(text || '');
  const parts = [];
  const re = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  let lastIndex = 0;
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = re.exec(s))) {
    const url = match[0];
    const start = match.index;
    if (start > lastIndex) parts.push(s.slice(lastIndex, start));
    const href = url.startsWith('http') ? url : `https://${url}`;
    parts.push(
      <a key={`${start}_${url}`} href={href} target="_blank" rel="noreferrer" className="link">
        {url}
      </a>
    );
    lastIndex = start + url.length;
  }
  if (lastIndex < s.length) parts.push(s.slice(lastIndex));
  return parts;
}

function MessageText({ text }) {
  const lines = String(text || '').split('\n');
  return (
    <div className="msgText">
      {lines.map((line, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <p key={idx} className="msgLine">
          {linkify(line)}
          {line.length === 0 ? <span className="msgEmpty">&nbsp;</span> : null}
        </p>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [conversations, setConversations] = useLocalStorageState(STORAGE_KEY, [defaultConversation()]);
  const [activeId, setActiveId] = useLocalStorageState('aitax.activeId.v1', conversations?.[0]?.id);
  const [query, setQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) || conversations[0], [conversations, activeId]);

  useEffect(() => {
    if (!activeId && conversations[0]?.id) setActiveId(conversations[0].id);
  }, [activeId, conversations, setActiveId]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [active?.messages?.length]);

  useEffect(() => {
    // Close drawer on desktop resize
    function onResize() {
      if (window.innerWidth > 960) setSidebarOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => (c.title || '').toLowerCase().includes(q));
  }, [conversations, search]);

  function updateConversation(id, updater) {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }

  function newConversation() {
    const c = defaultConversation();
    setConversations((prev) => [c, ...prev]);
    setActiveId(c.id);
    setQuery('');
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  function deleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveId((prevId) => {
      if (prevId !== id) return prevId;
      const remaining = conversations.filter((c) => c.id !== id);
      return remaining[0]?.id;
    });
  }

  function applyPrompt(text) {
    setQuery(text);
    textareaRef.current?.focus();
  }

  async function send() {
    const text = query.replace(/\s+$/g, '');
    if (!text || isSending || !active) return;

    setIsSending(true);
    setQuery('');

    const userMsg = { id: uid(), role: 'user', content: text };
    const assistantId = uid();
    const placeholder = { id: assistantId, role: 'assistant', content: '' };

    updateConversation(active.id, (c) => {
      const next = {
        ...c,
        updatedAt: new Date().toISOString(),
        messages: [...c.messages, userMsg, placeholder]
      };
      if (c.title === '새 대화') next.title = shortTitleFrom(text);
      return next;
    });

    try {
      const latest = conversations.find((c) => c.id === active.id) || active;
      const nextMessages = [...(latest.messages || []), userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await postChat(nextMessages);

      // typewriter effect
      await typeInto(
        (partial) => {
          updateConversation(active.id, (c) => ({
            ...c,
            updatedAt: new Date().toISOString(),
            messages: c.messages.map((m) => (m.id === assistantId ? { ...m, content: partial } : m))
          }));
        },
        res.reply || '(빈 응답)'
      );

      // add badge line if demo
      if (res.mode && res.mode !== 'openai') {
        updateConversation(active.id, (c) => ({
          ...c,
          updatedAt: new Date().toISOString(),
          messages: c.messages.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `${m.content}\n\n—\n현재 응답 모드: ${res.mode}`
                }
              : m
          )
        }));
      }
    } catch (e) {
      updateConversation(active.id, (c) => ({
        ...c,
        updatedAt: new Date().toISOString(),
        messages: c.messages.map((m) => (m.id === assistantId ? { ...m, content: `요청 중 오류가 발생했어요: ${String(e?.message || e)}` } : m))
      }));
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const starterPrompts = useMemo(
    () => [
      { k: 'vat', t: '부가세 신고 준비: 일반과세자, 이번 과세기간 매출/매입 정리 방법 알려줘' },
      { k: 'yearend', t: '연말정산 공제: 총급여/부양가족 기준으로 무엇부터 챙기면 돼?' },
      { k: 'transfer', t: '양도소득세: 1주택 비과세 요건을 체크리스트로 정리해줘' },
      { k: 'gift', t: '상속·증여: 부모→자녀 증여 시 기본 공제/신고 흐름 알려줘' }
    ],
    []
  );

  const showStarters = (active?.messages?.length || 0) <= 1;

  return (
    <div className="shell">
      {sidebarOpen ? <div className="backdrop" onClick={() => setSidebarOpen(false)} role="button" tabIndex={0} /> : null}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="title">
            <div className="logoRow">
              <div className="logoMark" aria-hidden="true">
                a
              </div>
              <div>
                <h1>ai세금</h1>
                <div className="subtitle">세금 질문을 더 빠르고, 더 깔끔하게.</div>
              </div>
            </div>
          </div>
          <div className="pill">beta</div>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={newConversation}>
            + 새 대화
          </button>
          <button
            className="btn danger"
            onClick={() => active && deleteConversation(active.id)}
            disabled={!active}
            title="현재 대화 삭제"
          >
            삭제
          </button>
        </div>

        <div className="search">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="대화 검색" />
        </div>

        <div className="convList">
          {filteredConversations.map((c) => {
            return (
              <div
                key={c.id}
                className={`convItem ${c.id === active?.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveId(c.id);
                  setSidebarOpen(false);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="name">{c.title || '새 대화'}</div>
                <div className="meta">
                  <span>{Math.max(0, (c.messages?.length || 0) - 1)} msgs</span>
                  <span>{formatTime(c.updatedAt || c.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="footerNote">
          <div className="footerLine">- 질문이 구체적일수록 정확해요.</div>
          <div className="footerLine">- 답변은 참고용이며, 중요한 의사결정은 세무사 상담을 권장합니다.</div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="left">
            <div className="h">
              <button className="iconBtn mobileOnly" onClick={() => setSidebarOpen(true)} aria-label="대화 목록 열기">
                ☰
              </button>
              <span className="topTitle">{active?.title || 'ai세금'}</span>
            </div>
            <div className="s">
              <span className="badge">Enter</span> 전송 · <span className="badge">Shift+Enter</span> 줄바꿈
            </div>
          </div>
          <div className="topRight">
            <button className="btn subtle desktopOnly" onClick={newConversation}>
              새 대화
            </button>
            <div className={`pill ${isSending ? 'live' : ''}`}>{isSending ? '응답 생성 중…' : '대기 중'}</div>
          </div>
        </div>

        <div className="chat" ref={chatRef}>
          <div className="chatInner">
            {showStarters ? (
              <div className="starterCard">
                <div className="starterTitle">빠른 시작</div>
                <div className="starterDesc">아래 예시를 눌러 시작하거나, 직접 상황을 적어주세요.</div>
                <div className="chips">
                  {starterPrompts.map((p) => (
                    <button key={p.k} className="chip" onClick={() => applyPrompt(p.t)}>
                      {p.t}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {(active?.messages || []).map((m) => (
              <div key={m.id} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <div className="role">
                  <span>{m.role === 'user' ? '사용자' : 'ai세금'}</span>
                  <span className="badge">{m.role}</span>
                </div>
                {m.role === 'assistant' && isSending && m.content === '' ? (
                  <div className="dots" aria-label="응답 생성 중">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <MessageText text={m.content} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="composerWrap">
          <div className="composer">
            <div>
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="예) 개인사업자(일반과세)인데 7~9월 매출이 3,000만원 정도예요. 부가세 신고는 어떻게 준비하나요?"
                disabled={!active}
              />
              <div className="small" style={{ marginTop: 8 }}>
                팁: “상황(소득/사업/양도) + 금액(대략) + 기간 + 증빙”을 같이 적으면 좋아요.
              </div>
            </div>

            <button className="btn primary send" onClick={send} disabled={isSending || !query.trim()}>
              {isSending ? '생성 중…' : '전송 →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
