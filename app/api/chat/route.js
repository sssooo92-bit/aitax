import { demoTaxReply } from '../../../lib/taxAssistant';

export const runtime = 'nodejs';

function safeJson(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

async function openaiReply({ messages }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) return null;

  const system = {
    role: 'system',
    content:
      '너는 “ai세금”의 한국 세금 도우미야. 사용자의 상황을 먼저 확인 질문으로 구조화하고, 계산은 단정하지 말고 가정/범위를 명시해. 마지막에 항상 “참고용(세무사 상담 권장)” 고지를 짧게 포함해.'
  };

  const payload = {
    model,
    messages: [system, ...(messages || [])],
    temperature: 0.2
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const reply = json?.choices?.[0]?.message?.content;
  if (!reply) throw new Error('OpenAI returned empty reply');

  return {
    id: json?.id || `openai_${Date.now()}`,
    createdAt: new Date().toISOString(),
    mode: 'openai',
    reply
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Try real model if key exists; otherwise fall back to demo.
    let result = null;
    try {
      result = await openaiReply({ messages });
    } catch (e) {
      // If OpenAI fails, fall back to demo but include error info.
      const demo = demoTaxReply({ messages });
      return safeJson({ ...demo, mode: 'demo_fallback', upstreamError: String(e?.message || e) });
    }

    if (!result) {
      return safeJson(demoTaxReply({ messages }));
    }

    return safeJson(result);
  } catch (e) {
    return safeJson({ error: 'bad_request', message: String(e?.message || e) }, 400);
  }
}
