/**
 * TrustRAG Core Retrieval & Reasoning Engine
 * Handles query preprocessing, intent classification (greetings/general vs legal),
 * statute/case retrieval, LLM synthesis, and trust scoring.
 */

import { legalStatutes, landmarkCaseLaws } from "../data/legalKnowledgeBase.js";
import { calculateTrustScore } from "./trustScorer.js";
import { generateLegalResponse } from "./llmService.js";

// Stopwords for search tokenization
const STOPWORDS = new Set([
  "what", "is", "the", "for", "under", "in", "and", "of", "to", "a", "an",
  "how", "can", "law", "indian", "act", "case", "does", "are", "do", "i", "tell", "me", "about"
]);

const GREETINGS = new Set([
  "hi", "hello", "hey", "greetings", "namaste", "good morning", "good afternoon", "good evening", "hola"
]);

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

function detectConversationalIntent(query) {
  const clean = (query || "").trim().toLowerCase().replace(/[^\w\s]/g, "");

  if (GREETINGS.has(clean) || clean.startsWith("hi ") || clean.startsWith("hello ")) {
    return "greeting";
  }

  if (
    clean === "who are you" ||
    clean === "what can you do" ||
    clean === "what is trustrag" ||
    clean === "help" ||
    clean === "how are you"
  ) {
    return "identity";
  }

  if (
    clean === "thank you" ||
    clean === "thanks" ||
    clean === "ok thanks" ||
    clean === "bye" ||
    clean === "goodbye"
  ) {
    return "thanks";
  }

  return null;
}

export function searchLegalKnowledge(query, selectedCategory = null) {
  const queryTokens = tokenize(query);
  const rawQuery = (query || "").toLowerCase();

  // Score statutes
  const scoredStatutes = legalStatutes.map(statute => {
    let score = 0;

    // Category match
    if (selectedCategory && statute.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      score += 15;
    }

    // Direct section or keyword mention
    if (rawQuery.includes(statute.section.toLowerCase())) score += 50;
    if (rawQuery.includes(statute.act.toLowerCase())) score += 30;

    // Keyword array matches
    for (const kw of statute.keywords) {
      if (rawQuery.includes(kw)) {
        score += 25;
      }
    }

    // Token frequency in title & summary
    const content = `${statute.title} ${statute.summary} ${statute.details}`.toLowerCase();
    for (const token of queryTokens) {
      if (content.includes(token)) {
        score += 8;
      }
    }

    return { statute, score };
  });

  // Score case laws
  const scoredCases = landmarkCaseLaws.map(c => {
    let score = 0;

    if (selectedCategory && c.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      score += 15;
    }

    if (rawQuery.includes(c.caseName.toLowerCase())) score += 60;

    for (const topic of c.topics) {
      if (rawQuery.includes(topic)) score += 25;
    }

    const content = `${c.caseName} ${c.significance} ${c.topics.join(" ")}`.toLowerCase();
    for (const token of queryTokens) {
      if (content.includes(token)) {
        score += 8;
      }
    }

    return { caseLaw: c, score };
  });

  // Filter meaningful matches (score > 10)
  const topStatutes = scoredStatutes
    .filter(item => item.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.statute);

  const topCases = scoredCases
    .filter(item => item.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(item => item.caseLaw);

  return { statutes: topStatutes, cases: topCases };
}

function synthesizeFallbackAnswer(query, statutes, cases) {
  if (statutes.length === 0 && cases.length === 0) {
    return `I am specialized in **Indian Legal assistance and statutory research**.\n\nPlease ask a specific legal question or select one of the suggestion chips below regarding:\n• **Criminal Law**: FIRs, arrest rights, bail, BNS / IPC offences\n• **Civil Law**: Cheque bounce (Sec 138 NI Act), consumer disputes, contract breaches\n• **Family Law**: Maintenance (Sec 125 CrPC), divorce, custody\n• **Constitutional Law**: Fundamental rights (Article 21), writ petitions (Articles 32 & 226)\n• **Corporate & Cyber Law**: Cheating, data protection, IT Act provisions.`;
  }

  const primaryStatute = statutes[0] || legalStatutes[0];
  const primaryCase = cases[0] || landmarkCaseLaws[0];
  let answer;

  if (query.toLowerCase().includes("cheque") || query.toLowerCase().includes("bounce") || primaryStatute.id === "stat-ni-138") {
    answer = `Under Section 138 of the Negotiable Instruments Act, 1881, if a cheque is dishonoured due to insufficiency of funds or exceeding agreed bank arrangements, the drawer commits a punishable offence.\n\n• Legal Consequences & Penalties:\n  - Imprisonment for a term extending up to 2 years, or\n  - Fine extending up to twice the amount of the cheque, or\n  - Both imprisonment and monetary fine.\n\n• Essential Statutory Timelines:\n  1. The cheque must be presented to the bank within 3 months of its issuance.\n  2. The payee must send a formal written Demand Notice within 30 days of receiving the cheque return memo.\n  3. The drawer is given 15 days from notice receipt to make payment.\n  4. If unpaid after 15 days, a criminal complaint under Sec 138 must be filed in the jurisdictional Magistrate Court within 1 month.\n\n• Landmark Precedent: In K. Bhaskaran vs Sankaran Vaidhyan Balan (AIR 1999 SC 1860), the Supreme Court clarified the 5 key territorial components for filing cheque dishonour complaints.`;
  } else if (query.toLowerCase().includes("fir") || query.toLowerCase().includes("complaint") || primaryStatute.id === "stat-crpc-154") {
    answer = `Under Section 154 of the Code of Criminal Procedure (CrPC) / Section 173 BNSS 2023:\n\n• First Information Report (FIR):\n  - An FIR is mandatory for cognizable offences (serious offences where police can arrest without warrant, e.g. murder, robbery, cheating).\n  - Registration of FIR is mandatory as ruled by the 5-Judge Constitution Bench in Lalita Kumari vs Govt. of UP (2014 2 SCC 1).\n  - Informant has a statutory right to receive an unpriced copy of the registered FIR immediately.\n  - 'Zero FIR' can be filed at any police station irrespective of territorial jurisdiction.\n\n• Police Complaint:\n  - Relates to non-cognizable offences or general grievances.\n  - Police cannot investigate a non-cognizable complaint without an order of a Magistrate (Sec 155 CrPC).`;
  } else if (query.toLowerCase().includes("maintenance") || query.toLowerCase().includes("wife") || primaryStatute.id === "stat-crpc-125") {
    answer = `Under Section 125 of the Code of Criminal Procedure (CrPC) / Section 144 BNSS:\n\n• Maintenance Rights:\n  - A wife, minor children (legitimate or illegitimate), and aged/infirm parents who are unable to maintain themselves have a statutory right to claim monthly maintenance from a person having sufficient means.\n  - Both working and non-working spouses are assessed based on comparative income, standard of living, and genuine financial liabilities.\n\n• Landmark Precedent:\n  - In Rajnesh vs Neha (2021 2 SCC 324), the Supreme Court formulated mandatory uniform guidelines across India, requiring both parties to submit a comprehensive Affidavit of Assets and Liabilities to fast-track interim maintenance orders within 60 days.`;
  } else if (query.toLowerCase().includes("arrest") || query.toLowerCase().includes("bail") || primaryStatute.id === "stat-crpc-437-439") {
    answer = `Under Indian Criminal Jurisprudence and CrPC Sections 41, 41A, 437, and 438:\n\n• Arrest Safeguards:\n  - In Arnesh Kumar vs State of Bihar (2014 8 SCC 273), the Supreme Court directed that in offences punishable with imprisonment up to 7 years, police cannot arrest routinely without serving a Section 41A CrPC notice of appearance.\n  - In D.K. Basu vs State of West Bengal (AIR 1997 SC 610), 11 mandatory guidelines were instituted, including transparent name tags for officers, preparation of an Arrest Memo, and notifying a relative within 8-12 hours.\n\n• Bail Remedies:\n  - Anticipatory Bail (Sec 438 CrPC) can be moved before the Sessions Court or High Court upon apprehension of arrest.\n  - Regular Bail (Sec 437/439 CrPC) can be sought upon surrender or detention.`;
  } else {
    // Dynamic synthesis based on primary statute
    answer = `Under ${primaryStatute.section} of the ${primaryStatute.act}:\n\n${primaryStatute.summary}\n\n• Key Legal Provisions:\n${primaryStatute.details}\n\n• Statutory Punishment / Remedy:\n${primaryStatute.punishment}\n\n• Relevant Precedent:\n${primaryCase.caseName} (${primaryCase.citation}): ${primaryCase.significance}`;
  }

  return answer;
}

export async function processLegalQuery({ query, category = null }) {
  // 1. Check conversational intents (greetings, identity, thanks)
  const conversationalIntent = detectConversationalIntent(query);

  if (conversationalIntent === "greeting") {
    return {
      query,
      answer: "Hello! 👋 I am **TrustRAG**, your AI Legal Assistant for Indian Law.\n\nHow can I help you today? You can ask any legal question such as:\n• Punishment and notice procedure for cheque bounce (Section 138 NI Act)\n• What is the difference between an FIR and a Police Complaint?\n• Maintenance rights of wife under Section 125 CrPC\n• Guidelines during police arrest under D.K. Basu\n• Procedure for anticipatory bail or mutual consent divorce",
      trust_score: 95,
      confidence_label: "High Confidence",
      badge_title: "AI Assistant Ready",
      badge_sub: "Ready to assist with Indian statutory laws and case precedents",
      color: "#22c55e",
      factors: ["Direct interactive legal assistance session active"],
      sources: [
        { id: "stat-guide-1", title: "Indian Legal Corpus", subtitle: "Bharatiya Nyaya Sanhita, IPC, CrPC, NI Act", tag: "System Guide", icon: "doc" },
        { id: "stat-guide-2", title: "Supreme Court Database", subtitle: "Landmark Precedents & Constitutional Rulings", tag: "Jurisprudence", icon: "book" }
      ]
    };
  }

  if (conversationalIntent === "identity") {
    return {
      query,
      answer: "I am **TrustRAG** — a trusted Legal Retrieval-Augmented Generation (RAG) assistant designed for Indian Law.\n\nI assist law students, advocates, and citizens by providing:\n1. **Statutory Provisions**: Exact sections from IPC/BNS, CrPC/BNSS, NI Act, Indian Evidence Act, etc.\n2. **Landmark Case Precedents**: Authoritative Supreme Court and High Court citations.\n3. **Verifiable Trust Scores**: Quantified reliability metrics for every legal answer.\n4. **Document Analysis**: Review of legal notices and contract clauses.",
      trust_score: 95,
      confidence_label: "High Confidence",
      badge_title: "Verified System Capabilities",
      badge_sub: "Integrated with Indian statutory corpus and judicial precedents",
      color: "#22c55e",
      factors: ["Verified architectural capabilities"],
      sources: [
        { id: "stat-guide-1", title: "Indian Legal System", subtitle: "Statutory Law & Landmark Precedents", tag: "Primary Source", icon: "doc" }
      ]
    };
  }

  if (conversationalIntent === "thanks") {
    return {
      query,
      answer: "You're very welcome! If you have any further questions regarding Indian Law, feel free to ask anytime. Stay informed and legally empowered! ⚖️🛡️",
      trust_score: 95,
      confidence_label: "High Confidence",
      badge_title: "Ready for Next Query",
      badge_sub: "Feel free to ask another legal question",
      color: "#22c55e",
      factors: ["Session active"],
      sources: []
    };
  }

  // 2. Search knowledge base
  const { statutes, cases } = searchLegalKnowledge(query, category);

  // 3. Synthesize answer with LLM or Fallback Engine
  let answer = await generateLegalResponse({
    query,
    statutes,
    cases
  });

  if (!answer) {
    answer = synthesizeFallbackAnswer(query, statutes, cases);
  }

  // 4. Calculate Trust Score
  const trustAnalysis = calculateTrustScore({
    query,
    answer,
    matchedStatutes: statutes,
    matchedCases: cases
  });

  // 5. Format structured sources for frontend
  const sources = [
    ...statutes.map(s => ({
      id: s.id,
      title: s.section,
      subtitle: s.act,
      tag: s.tag || "Primary Source",
      icon: s.icon || "doc",
      details: s.summary
    })),
    ...cases.map(c => ({
      id: c.id,
      title: c.caseName,
      subtitle: c.citation,
      tag: c.tag || "Case Law",
      icon: c.icon || "book",
      details: c.significance
    }))
  ];

  return {
    query,
    answer,
    trust_score: trustAnalysis.trust_score,
    confidence_label: trustAnalysis.confidence_label,
    badge_title: trustAnalysis.badge_title,
    badge_sub: trustAnalysis.badge_sub,
    color: trustAnalysis.color,
    factors: trustAnalysis.factors,
    sources
  };
}
