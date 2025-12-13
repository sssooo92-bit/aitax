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
  return {
    id,
    title: '새 대화',
    createdAt: new Date().toISOString(),
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

export default function HomePage() {
  const [conversations, setConversations] = useLocalStorageState(STORAGE_KEY, [defaultConversation()]);
  const [activeId, setActiveId] = useLocalStorageState('aitax.activeId.v1', conversations?.[0]?.id);
  const [query, setQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [search, setSearch] = useState('');

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
            messages: c.messages.map((m) => (m.id === assistantId ? { ...m, content: partial } : m))
          }));
        },
        res.reply || '(빈 응답)'
      );

      // add badge line if demo
      if (res.mode && res.mode !== 'openai') {
        updateConversation(active.id, (c) => ({
          ...c,
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

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="title">
            <h1>ai세금</h1>
            <div className="subtitle">ChatGPT 스타일 세금 상담 UI</div>
          </div>
          <div className="pill">MVP</div>
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
            const last = c.messages?.[c.messages.length - 1];
            return (
              <div
                key={c.id}
                className={`convItem ${c.id === active?.id ? 'active' : ''}`}
                onClick={() => setActiveId(c.id)}
                role="button"
                tabIndex={0}
              >
                <div className="name">{c.title || '새 대화'}</div>
                <div className="meta">
                  <span>{(c.messages?.length || 0) - 1} msgs</span>
                  <span>{formatTime(last?.id ? c.createdAt : c.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="footerNote">
          - 질문이 구체적일수록 정확해요.\n- 답변은 참고용이며, 중요한 의사결정은 세무사 상담을 권장합니다.
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="left">
            <div className="h">{active?.title || 'ai세금'}</div>
            <div className="s">
              <span className="badge">Enter</span> 전송 · <span className="badge">Shift+Enter</span> 줄바꿈
            </div>
          </div>
          <div className="pill">{isSending ? '응답 생성 중…' : '대기 중'}</div>
        </div>

        <div className="chat" ref={chatRef}>
          <div className="chatInner">
            {(active?.messages || []).map((m) => (
              <div key={m.id} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <div className="role">
                  <span>{m.role === 'user' ? '사용자' : 'ai세금'}</span>
                  <span className="badge">{m.role}</span>
                </div>
                {m.content}
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
              {isSending ? '생성 중…' : '전송'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
