import { useState, useEffect, useRef } from "react";
import { askTrustRag } from "./api.js";
import "./App.css";

/* ── source name shortener ── */
const SOURCE_SHORT = {
  "Negotiable Instruments Act, 1881": "NI Act",
  "Consumer Protection Act, 2019": "Consumer Protection Act",
  "Prohibition of Child Marriage Act, 2006": "Child Marriage Act",
  "Code of Criminal Procedure, 1973": "CrPC",
  "Bharatiya Nagarik Suraksha Sanhita, 2023": "BNSS",
};

function shortSourceName(raw) {
  if (!raw) return raw;
  for (const [full, short] of Object.entries(SOURCE_SHORT)) {
    if (raw.includes(full)) return raw.replace(full, short);
  }
  return raw;
}

function formatSourceChip(src) {
  const name = shortSourceName(src.source);
  if (src.section_number) return `${name} s.${src.section_number}`;
  return name;
}

/* ── label colours ── */
const LABEL_COLOR = {
  High: "#22c55e",
  Medium: "#f59e0b",
  Low: "#ef4444",
  Abstained: "#9ca3af",
  Unverified: "#f97316",
};

/* ── static suggestion chips ── */
const SUGGESTIONS = [
  "What is the time limit for filing a complaint in a cheque bounce case?",
  "What is the notice period for a cheque bounce case?",
  "Is there a time limit to file an FIR?",
  "What is the minimum marriage age for a woman in India?",
  "What is the time limit for filing a consumer complaint?",
];

/* ── Trust Score Ring ── */
function TrustScoreRing({ score, label }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = LABEL_COLOR[label] || "#6b7280";

  return (
    <div className="trust-ring-wrapper">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease" }}
        />
      </svg>
      <div className="trust-ring-center">
        <span className="trust-ring-score">{score}%</span>
        <span className="trust-ring-label" style={{ color }}>{label}</span>
      </div>
    </div>
  );
}

/* ── Typewriter Answer ── */
function TypewriterAnswer({ text, isLatest, isNew }) {
  const shouldAnimate = Boolean(isNew && isLatest);
  const [typedLength, setTypedLength] = useState(() => (shouldAnimate ? 0 : text.length));

  useEffect(() => {
    if (!shouldAnimate) return;
    let current = 0;
    const speed = 14;
    const step = text.length > 500 ? 4 : text.length > 250 ? 3 : 2;
    const timer = setInterval(() => {
      current += step;
      if (current >= text.length) { setTypedLength(text.length); clearInterval(timer); }
      else setTypedLength(current);
    }, speed);
    return () => clearInterval(timer);
  }, [text, shouldAnimate]);

  const displayedText = shouldAnimate && typedLength < text.length ? text.slice(0, typedLength) : text;
  const isTyping = shouldAnimate && typedLength < text.length;

  return (
    <>
      {displayedText.split("\n").map((line, li) =>
        line.trim() === "" ? null : <p key={li} className="bubble-text">{line}</p>
      )}
      {isTyping && <span className="typewriter-cursor">▌</span>}
    </>
  );
}

/* ── Main App ── */
function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    try { const s = localStorage.getItem("trustrag_dark_mode"); return s ? JSON.parse(s) : false; } catch { return false; }
  });
  const [notification, setNotification] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { try { localStorage.setItem("trustrag_dark_mode", JSON.stringify(darkMode)); } catch {} }, [darkMode]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const handleSend = async (overrideQuestion = null) => {
    const q = (overrideQuestion || question).trim();
    if (!q || loading) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setQuestion("");
    setLoading(true);
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      const result = await askTrustRag(q);
      setMessages((prev) => [
        ...prev,
        { question: q, response: result, time, isNew: true },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { question: q, error: error.message, time, isNew: true },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSend(); };

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const lastResponse = lastMessage && !lastMessage.error ? lastMessage.response : null;

  return (
    <div className={`shell${darkMode ? " dark" : ""}`}>
      {notification && (
        <div className="toast-notification"><span>{notification}</span></div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div className="logo-title">TrustRAG</div>
            <div className="logo-sub">Legal AI Assistant</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active" id="nav-new-chat"
            onClick={() => { setMessages([]); setQuestion(""); showNotification("New chat started."); }}>
            <span className="nav-icon">💬</span> New Chat
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="project-badge">
            <span className="project-icon">🎓</span>
            <div>
              <div className="project-title">Final Year Project</div>
              <div className="project-sub">Built with ❤️ by Team TrustRAG</div>
            </div>
          </div>
        </div>

        <div className="theme-toggle-row">
          <span>☀️</span>
          <button className={`toggle-btn${darkMode ? " on" : ""}`}
            onClick={() => setDarkMode(!darkMode)} id="theme-toggle" aria-label="Toggle dark mode">
            <span className="toggle-thumb" />
          </button>
          <span>🌙</span>
        </div>
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div className="main-col">
        <div className="topbar">
          <div className="topbar-greeting">
            <h2 className="greeting-text">TrustRAG Legal Assistant ⚖️</h2>
            <p className="greeting-sub">Ask any legal question. Get verified answers with statutory trust scores.</p>
          </div>
        </div>

        <div className="content-row">
          {/* Chat column */}
          <div className="chat-col">
            <div className="chat-area" id="chat-area">
              {messages.length === 0 ? (
                <div className="empty-chat-state">
                  <div className="empty-icon">⚖️</div>
                  <h3>Welcome to TrustRAG</h3>
                  <p>Ask a question about Indian law to get started.</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className="message-pair">
                    {/* User bubble */}
                    <div className="user-bubble-row">
                      <div className="user-bubble">
                        <p className="bubble-text">{msg.question}</p>
                        <span className="bubble-time">{msg.time} ✓✓</span>
                      </div>
                      <div className="user-avatar-sm">👤</div>
                    </div>

                    {/* AI bubble or error */}
                    <div className="ai-bubble-row">
                      <div className="ai-avatar-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      {msg.error ? (
                        <div className="ai-bubble error-bubble">
                          <p className="bubble-text error-text">⚠️ {msg.error}</p>
                          <span className="bubble-time">{msg.time}</span>
                        </div>
                      ) : (
                        <div className="ai-bubble">
                          <TypewriterAnswer
                            text={msg.response.answer}
                            isLatest={i === messages.length - 1}
                            isNew={Boolean(msg.isNew)}
                          />

                          {/* Source chips */}
                          {msg.response.sources && msg.response.sources.length > 0 && (
                            <div className="source-chips">
                              {msg.response.sources.map((src, si) => (
                                <span key={si} className="source-chip">{formatSourceChip(src)}</span>
                              ))}
                            </div>
                          )}

                          <div className="bubble-footer">
                            <span className="bubble-time">{msg.time}</span>
                            {msg.response.latency_seconds != null && (
                              <span className="latency-text">{msg.response.latency_seconds.toFixed(1)}s</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="ai-bubble-row loading-row">
                  <div className="ai-avatar-sm pulse">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="ai-bubble loading-bubble">
                    <div className="typing-dots"><span></span><span></span><span></span></div>
                    <span className="loading-text">Searching the Acts and generating an answer. This can take up to a minute.</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="input-section">
              <div className="input-row">
                <input
                  ref={inputRef} id="question-input" type="text"
                  className="question-input"
                  placeholder="Ask your legal question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off" autoFocus
                />
                <button
                  className="send-btn" id="send-btn"
                  onClick={() => handleSend()}
                  disabled={!question.trim() || loading}
                  aria-label="Send query"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <div className="suggestions-row">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} id={`suggestion-${i}`} className="suggestion-chip"
                    onClick={() => { setQuestion(s); handleSend(s); }}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="disclaimer">Academic prototype, not legal advice.</p>
            </div>
          </div>

          {/* Right panel — Trust Score + Sources */}
          {lastResponse && (
            <div className="right-panel">
              {/* Trust Score Panel */}
              <div className="panel-card" id="trust-panel">
                <div className="panel-card-header">
                  <span className="panel-title">Trust Score</span>
                  <span className="panel-help" title="Calculated from statutory grounding & case law citations">?</span>
                </div>

                {(lastResponse.label === "High" || lastResponse.label === "Medium" || lastResponse.label === "Low") && lastResponse.trust_score != null ? (
                  <>
                    <TrustScoreRing score={lastResponse.trust_score} label={lastResponse.label} />
                    <div className={`trust-badge-pill ${lastResponse.label.toLowerCase()}`}>
                      <span>🛡️</span>
                      <div>
                        <div className="trust-badge-title">{lastResponse.label} confidence</div>
                        <div className="trust-badge-sub">
                          {lastResponse.score_type === "support_only"
                            ? "Citation support score"
                            : lastResponse.score_type === "combined"
                            ? "Full trust score"
                            : "Trust score"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : lastResponse.label === "Abstained" ? (
                  <div className="trust-badge-pill abstained">
                    <span>⏸️</span>
                    <div>
                      <div className="trust-badge-title">Abstained</div>
                      <div className="trust-badge-sub">The model chose not to score this answer.</div>
                    </div>
                  </div>
                ) : lastResponse.label === "Unverified" ? (
                  <div className="trust-badge-pill unverified">
                    <span>⚠️</span>
                    <div>
                      <div className="trust-badge-title">Unverified</div>
                      <div className="trust-badge-sub warning-text">The answer could not be traced to a cited section. Do not rely on it.</div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Sources panel */}
              <div className="panel-card" id="sources-panel">
                <div className="panel-card-header">
                  <span className="panel-title">Sources</span>
                  <span className="sources-count">{lastResponse.sources?.length || 0}</span>
                </div>
                <div className="sources-list">
                  {lastResponse.sources && lastResponse.sources.length > 0 ? (
                    lastResponse.sources.map((src, i) => (
                      <span key={i} className="source-chip panel-source-chip" id={`source-${i}`}>
                        {formatSourceChip(src)}
                      </span>
                    ))
                  ) : (
                    <p className="empty-text">No cited sources for this answer.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
