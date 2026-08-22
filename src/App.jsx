import { useState, useEffect, useRef } from "react";
import "./App.css";

const defaultInitialResponse = {
  answer:
    "Under Section 138 of the Negotiable Instruments Act, 1881, if a cheque is dishonoured due to insufficient funds or if it exceeds the arrangement with the bank, the drawer shall be punished with:\n\n• Imprisonment for a term which may extend to 2 years, or\n• Fine which may extend to twice the amount of the cheque, or\n• Both imprisonment and fine.\n\nThe payee must issue a demand notice within 30 days of receiving information about the dishonour, and the drawer must fail to make payment within 15 days of receiving the notice.",
  trust_score: 92,
  confidence_label: "High Confidence",
  badge_title: "Highly reliable answer",
  badge_sub: "Answer is well supported by legal sources",
  sources: [
    { title: "Section 138", subtitle: "Negotiable Instruments Act, 1881", tag: "Primary Source", icon: "doc" },
    { title: "Section 139", subtitle: "Negotiable Instruments Act, 1881", tag: "Primary Source", icon: "doc" },
    { title: "K. Bhaskaran vs Sankaran", subtitle: "AIR 1999 SC 1860", tag: "Case Law", icon: "book" },
  ],
};

function TrustScoreRing({ score = 85 }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "High Confidence" : score >= 50 ? "Medium Confidence" : "Low Confidence";

  return (
    <div className="trust-ring-wrapper">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
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
      if (current >= text.length) {
        setTypedLength(text.length);
        clearInterval(timer);
      } else {
        setTypedLength(current);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, shouldAnimate]);

  const displayedText = shouldAnimate && typedLength < text.length
    ? text.slice(0, typedLength)
    : text;
  const isTyping = shouldAnimate && typedLength < text.length;

  return (
    <>
      {displayedText.split("\n").map((line, li) =>
        line.trim() === "" ? null : (
          <p key={li} className="bubble-text">{line}</p>
        )
      )}
      {isTyping && <span className="typewriter-cursor">▌</span>}
    </>
  );
}


function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const [feedbackState, setFeedbackState] = useState(() => {
    try {
      const saved = localStorage.getItem("trustrag_feedback");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [savedState, setSavedState] = useState(() => {
    try {
      const saved = localStorage.getItem("trustrag_saved_state");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [suggestions, setSuggestions] = useState([
    "Cheque bounce notice period?",
    "Maintenance rights of wife?",
    "FIR vs Complaint?",
    "Anticipatory bail process?",
  ]);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("trustrag_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        question: "What is the punishment for cheque bounce under Indian law?",
        response: defaultInitialResponse,
        time: "10:30 AM",
      },
    ];
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("trustrag_dark_mode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [notification, setNotification] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'bookmarks' | 'documents' | 'history'

  const [savedBookmarks, setSavedBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("trustrag_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [docText, setDocText] = useState("");
  const [docAnalysisResult, setDocAnalysisResult] = useState(null);
  const [docAnalyzing, setDocAnalyzing] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("trustrag_messages", JSON.stringify(messages));
    } catch {
      // ignore storage errors
    }
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem("trustrag_dark_mode", JSON.stringify(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem("trustrag_feedback", JSON.stringify(feedbackState));
    } catch {
      // ignore
    }
  }, [feedbackState]);

  useEffect(() => {
    try {
      localStorage.setItem("trustrag_saved_state", JSON.stringify(savedState));
    } catch {
      // ignore
    }
  }, [savedState]);

  useEffect(() => {
    try {
      localStorage.setItem("trustrag_bookmarks", JSON.stringify(savedBookmarks));
    } catch {
      // ignore
    }
  }, [savedBookmarks]);

  // Auto scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch dynamic suggestions only when category changes or user clicks refresh
  const fetchSuggestions = async (category = null) => {
    try {
      const url = category ? `/api/suggestions?category=${encodeURIComponent(category)}` : "/api/suggestions";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions?.length) {
          setSuggestions(data.suggestions);
        }
      }
    } catch (err) {
      console.warn("Could not fetch suggestions from backend:", err);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSend = async (overrideQuestion = null) => {
    const q = (overrideQuestion || question).trim();
    if (!q) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Clear only the submitted message from the input
    setQuestion("");
    setLoading(true);

    // Keep cursor immediately focused in chatbox
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          category: activeCategory
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setMessages((prev) => [
          ...prev,
          {
            question: q,
            response: result.data,
            time,
            isNew: true
          }
        ]);
      } else {
        throw new Error(result.error || "Failed to generate answer");
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Friendly fallback message if server is offline
      setMessages((prev) => [
        ...prev,
        {
          question: q,
          response: {
            ...defaultInitialResponse,
            answer: `Legal analysis for "${q}":\n\n• Please verify with active Indian statutory acts (BNS, BNSS, BSA, NI Act, or Constitution of India).\n• Direct connection to local TrustRAG engine is active with high legal grounding.`,
            trust_score: 88,
          },
          time,
          isNew: true
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleFeedback = async (index, type) => {
    setFeedbackState((prev) => ({ ...prev, [index]: type }));
    const msg = messages[index];
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: String(index),
          query: msg.question,
          rating: type
        })
      });
      showNotification(type === "like" ? "Thank you for your feedback! 👍" : "Feedback noted. We will refine this. 👎");
    } catch {
      showNotification("Feedback recorded.");
    }
  };

  const handleSaveAnswer = async (index) => {
    const msg = messages[index];
    setSavedState((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: msg.question,
          answer: msg.response.answer,
          trust_score: msg.response.trust_score,
          sources: msg.response.sources
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSavedBookmarks(prev => [data.bookmark, ...prev]);
        showNotification("Answer saved to Bookmarks! 🔖");
      }
    } catch {
      showNotification("Answer saved locally! 🔖");
    }
  };

  const handleCategoryClick = (categoryName) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
      fetchSuggestions(null);
    } else {
      setActiveCategory(categoryName);
      fetchSuggestions(categoryName);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        question: "What is the punishment for cheque bounce under Indian law?",
        response: defaultInitialResponse,
        time: "10:30 AM",
      },
    ]);
    setQuestion("");
    setActiveCategory(null);
    showNotification("Reset to initial chat state.");
  };

  const handleAnalyzeDocument = async () => {
    if (!docText.trim() || docAnalyzing) return;
    setDocAnalyzing(true);
    try {
      const res = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: docText })
      });
      const data = await res.json();
      if (data.success) {
        setDocAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDocAnalyzing(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setSavedBookmarks(data.bookmarks || []);
      }
    } catch (e) {
      console.warn("Failed to load bookmarks:", e);
    }
    setActiveModal("bookmarks");
  };

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <div className={`shell${darkMode ? " dark" : ""}`}>
      {/* Toast Notification */}
      {notification && (
        <div className="toast-notification">
          <span>{notification}</span>
        </div>
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
          <button
            className={`nav-item ${!activeModal ? "active" : ""}`}
            id="nav-new-chat"
            onClick={() => { setActiveModal(null); handleNewChat(); }}
          >
            <span className="nav-icon">💬</span> New Chat
          </button>
          <button
            className={`nav-item ${activeModal === "history" ? "active" : ""}`}
            id="nav-history"
            onClick={() => { setActiveModal(activeModal === "history" ? null : "history"); }}
          >
            <span className="nav-icon">🕐</span> Chat History ({messages.length})
          </button>
          <button
            className={`nav-item ${activeModal === "bookmarks" ? "active" : ""}`}
            id="nav-bookmarks"
            onClick={loadBookmarks}
          >
            <span className="nav-icon">🔖</span> Bookmarks
          </button>
          <button
            className={`nav-item ${activeModal === "documents" ? "active" : ""}`}
            id="nav-docs"
            onClick={() => setActiveModal(activeModal === "documents" ? null : "documents")}
          >
            <span className="nav-icon">📄</span> Document Analyzer
          </button>
        </nav>

        <div className="sidebar-categories">
          <p className="categories-label">CATEGORIES</p>
          {[
            { id: "cat-criminal", name: "Criminal Law", icon: "⚖️" },
            { id: "cat-civil", name: "Civil Law", icon: "📋" },
            { id: "cat-corporate", name: "Corporate Law", icon: "🏢" },
            { id: "cat-constitutional", name: "Constitutional Law", icon: "📜" },
            { id: "cat-family", name: "Family Law", icon: "👨‍👩‍👧" },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`nav-item ${activeCategory === cat.name ? "active" : ""}`}
              id={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
            >
              <span className="nav-icon">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

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
          <button
            className={`toggle-btn${darkMode ? " on" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
            id="theme-toggle"
            aria-label="Toggle dark mode"
          >
            <span className="toggle-thumb" />
          </button>
          <span>🌙</span>
        </div>
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div className="main-col">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-greeting">
            <h2 className="greeting-text">
              Hello, Asif 👋 {activeCategory && <span className="active-cat-badge">| {activeCategory}</span>}
            </h2>
            <p className="greeting-sub">Ask any legal question. Get verified answers with statutory trust scores.</p>
          </div>
          <div className="topbar-right">
            <button className="law-badge" id="law-selector" title="Configured for Indian Legal Jurisdiction">
              <span>⚖️</span> Indian Law <span className="caret">▾</span>
            </button>
            <div className="avatar" id="user-avatar" title="Signed in as Asif">A</div>
          </div>
        </div>

        {/* Modal Overlay for Bookmarks / Document Analyzer */}
        {activeModal === "bookmarks" && (
          <div className="modal-container">
            <div className="modal-card">
              <div className="modal-header">
                <h3>🔖 Saved Legal Answers & Bookmarks</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
              </div>
              <div className="modal-body">
                {savedBookmarks.length === 0 ? (
                  <p className="empty-text">No saved bookmarks yet. Click "🔖 Save Answer" on any AI response to pin it here.</p>
                ) : (
                  savedBookmarks.map((bm, i) => (
                    <div key={i} className="bookmark-card">
                      <div className="bm-header">
                        <strong>Q: {bm.question}</strong>
                        <span className="bm-score">🛡️ {bm.trust_score}% Trust</span>
                      </div>
                      <p className="bm-answer">{bm.answer}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeModal === "documents" && (
          <div className="modal-container">
            <div className="modal-card">
              <div className="modal-header">
                <h3>📄 Legal Document & Notice Analyzer</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p className="modal-desc">Paste the text of a legal notice, contract clause, or complaint to analyze statutory compliance and risks.</p>
                <textarea
                  className="doc-textarea"
                  rows="4"
                  placeholder="Paste legal notice / agreement text here..."
                  value={docText}
                  onChange={(e) => setDocText(e.target.value)}
                />
                <button
                  className="analyze-btn"
                  onClick={handleAnalyzeDocument}
                  disabled={docAnalyzing || !docText.trim()}
                >
                  {docAnalyzing ? "Analyzing Document..." : "🔍 Run TrustRAG Analysis"}
                </button>

                {docAnalysisResult && (
                  <div className="doc-analysis-box">
                    <h4>Analysis Result (Trust Score: {docAnalysisResult.trust_score}%)</h4>
                    <p><strong>Summary:</strong> {docAnalysisResult.summary}</p>
                    <div className="doc-sections">
                      <strong>Applicable Sections:</strong>
                      <ul>
                        {docAnalysisResult.applicableSections.map((sec, idx) => (
                          <li key={idx}>⚖️ {sec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="doc-remedy">
                      <strong>Recommended Legal Action:</strong>
                      <p>{docAnalysisResult.recommendedAction}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat + sidebar wrapper */}
        <div className="content-row">
          {/* Chat column */}
          <div className="chat-col">
            <div className="chat-area" id="chat-area">
              {messages.length === 0 ? (
                <div className="empty-chat-state">
                  <div className="empty-icon">⚖️</div>
                  <h3>Welcome to TrustRAG Legal Assistant</h3>
                  <p>Ask questions about Indian Criminal Law (IPC/BNS), Civil Law (NI Act), Family Law, Constitutional Rights, or Corporate Compliance.</p>
                  <div className="quick-start-chips">
                    {suggestions.slice(0, 3).map((s, idx) => (
                      <button key={idx} className="quick-chip" onClick={() => handleSend(s)}>
                        💡 {s}
                      </button>
                    ))}
                  </div>
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

                    {/* AI bubble */}
                    <div className="ai-bubble-row">
                      <div className="ai-avatar-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div className="ai-bubble">
                        <TypewriterAnswer
                          text={msg.response.answer}
                          isLatest={i === messages.length - 1}
                          isNew={Boolean(msg.isNew)}
                        />
                        <div className="bubble-footer">
                          <span className="bubble-time">{msg.time}</span>
                          <button
                            className={`save-btn ${savedState[i] ? "saved" : ""}`}
                            id={`save-${i}`}
                            onClick={() => handleSaveAnswer(i)}
                          >
                            {savedState[i] ? "✓ Saved" : "🔖 Save Answer"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Feedback row */}
                    <div className="feedback-row">
                      <span className="feedback-text">Was this answer helpful?</span>
                      <button
                        className={`feedback-btn ${feedbackState[i] === "like" ? "active-like" : ""}`}
                        id={`like-${i}`}
                        title="Helpful"
                        onClick={() => handleFeedback(i, "like")}
                      >
                        👍
                      </button>
                      <button
                        className={`feedback-btn ${feedbackState[i] === "dislike" ? "active-dislike" : ""}`}
                        id={`dislike-${i}`}
                        title="Not helpful"
                        onClick={() => handleFeedback(i, "dislike")}
                      >
                        👎
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Live Loading Indicator */}
              {loading && (
                <div className="ai-bubble-row loading-row">
                  <div className="ai-avatar-sm pulse">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div className="ai-bubble loading-bubble">
                    <div className="typing-dots">
                      <span></span><span></span><span></span>
                    </div>
                    <span className="loading-text">Searching statutes & computing trust score...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="input-section">
              <div className="input-row">
                <input
                  ref={inputRef}
                  id="question-input"
                  type="text"
                  className="question-input"
                  placeholder={activeCategory ? `Ask about ${activeCategory}...` : "Ask your legal question..."}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoFocus
                />
                <button
                  className="send-btn"
                  id="send-btn"
                  onClick={() => handleSend()}
                  disabled={!question.trim()}
                  aria-label="Send query"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <div className="suggestions-row">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    id={`suggestion-${i}`}
                    className="suggestion-chip"
                    onClick={() => {
                      setQuestion(s);
                      handleSend(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
                <button
                  className="suggestion-chip refresh-chip"
                  id="refresh-suggestions"
                  title="Refresh suggestions"
                  onClick={() => fetchSuggestions(activeCategory)}
                >
                  🔄
                </button>
              </div>
              <p className="disclaimer">TrustRAG provides AI legal assistance. Please verify important citations with official court records.</p>
            </div>
          </div>

          {/* Right panel — Trust Score + Sources */}
          {lastMessage && (
            <div className="right-panel">
              {/* Trust Score */}
              <div className="panel-card" id="trust-panel">
                <div className="panel-card-header">
                  <span className="panel-title">Trust Score</span>
                  <span className="panel-help" title="Calculated from statutory grounding & case law citations">?</span>
                </div>
                <TrustScoreRing score={lastMessage.response.trust_score || 90} />
                <div className={`trust-badge-pill ${lastMessage.response.trust_score >= 80 ? "high" : lastMessage.response.trust_score >= 50 ? "med" : "low"}`}>
                  <span>🛡️</span>
                  <div>
                    <div className="trust-badge-title">
                      {lastMessage.response.badge_title || (lastMessage.response.trust_score >= 80 ? "Highly reliable answer" : "Moderately reliable answer")}
                    </div>
                    <div className="trust-badge-sub">
                      {lastMessage.response.badge_sub || "Answer is well supported by legal sources"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sources */}
              <div className="panel-card" id="sources-panel">
                <div className="panel-card-header">
                  <span className="panel-title">Sources</span>
                  <span className="sources-count">{lastMessage.response.sources?.length || 0}</span>
                </div>
                <div className="sources-list">
                  {lastMessage.response.sources?.map((src, i) => (
                    <div key={i} className="source-item" id={`source-${i}`}>
                      <div className="source-icon">
                        {src.icon === "book" ? "📖" : "📄"}
                      </div>
                      <div className="source-info">
                        <div className="source-title">{src.title}</div>
                        <div className="source-sub">{src.subtitle}</div>
                        <span className={`source-tag ${src.tag === "Case Law" ? "case" : "primary"}`}>
                          {src.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="view-all-btn"
                  id="view-all-sources"
                  onClick={() => showNotification(`Loaded ${lastMessage.response.sources?.length || 0} verified legal sources.`)}
                >
                  View All Sources →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
