import React, { useEffect, useRef, useState } from 'react';
import { getHistory, sendChatMessage } from '../api';
import MessageBubble from './MessageBubble';

/**
 * Chat component renders:
 * - Messages area (history + new messages)
 * - Input bar at the bottom
 * - Loading indicator and error box
 * Manages simple session via api.js (localStorage + header).
 */
// PUBLIC_INTERFACE
export default function Chat() {
  const [messages, setMessages] = useState([]); // [{ role: 'user'|'assistant', content: string }]
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getHistory();
        if (!active) return;
        const msgs = Array.isArray(data?.messages) ? data.messages : [];
        setMessages(msgs.map(m => ({ role: m.role, content: m.content })));
      } catch (e) {
        setError(e?.message || 'Failed to load history.');
      } finally {
        setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    setError('');
    const text = input.trim();
    if (!text) {
      setError('Please enter a question.');
      return;
    }

    // Optimistically add the user message
    const newMsgs = [...messages, { role: 'user', content: text }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const resp = await sendChatMessage(text);
      const answer = resp?.answer ?? '(No answer returned)';
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (e) {
      setError(e?.message || 'Failed to send message.');
      // Optionally keep the user message in the list; do nothing else
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) sendMessage();
    }
  };

  return (
    <section className="chat-shell" aria-label="Chat interface">
      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      <div className="messages" ref={scrollRef} role="list" aria-live="polite" aria-busy={initializing || loading}>
        {messages.length === 0 && !initializing && (
          <div className="state-text">Start by asking an academic question...</div>
        )}

        {messages.map((m, idx) => (
          <MessageBubble key={idx} role={m.role}>
            {m.content}
          </MessageBubble>
        ))}

        {loading && (
          <div className="state-text">Thinking…</div>
        )}
      </div>

      <div className="input-bar">
        <div className="input-inner">
          <textarea
            className="chat-input"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your question and press Enter…"
            aria-label="Your question"
            disabled={loading}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={loading || input.trim() === ''}
            aria-label="Send message"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </section>
  );
}
