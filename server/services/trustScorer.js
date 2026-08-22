/**
 * Trust Score Calculator for TrustRAG
 * Evaluates answer reliability based on statutory grounding, landmark case precedents,
 * factual completeness, and citation veracity.
 */

export function calculateTrustScore({ query, answer, matchedStatutes = [], matchedCases = [] }) {
  let score = 50; // Base starting confidence
  const factors = [];

  // 1. Statutory Grounding (Up to +25 points)
  if (matchedStatutes.length >= 2) {
    score += 25;
    factors.push("Corroborated by multiple primary statutory provisions");
  } else if (matchedStatutes.length === 1) {
    score += 18;
    factors.push("Backed by primary statutory act & section");
  } else {
    score -= 10;
    factors.push("General legal doctrine with limited statutory citation");
  }

  // 2. Landmark Precedent Support (Up to +20 points)
  if (matchedCases.length >= 2) {
    score += 20;
    factors.push("Supported by multiple Supreme Court / High Court precedents");
  } else if (matchedCases.length === 1) {
    score += 14;
    factors.push("Supported by Supreme Court precedent");
  } else {
    factors.push("Statutory rule without cited case law precedent");
  }

  // 3. Procedural / Penalty Specificity (Up to +10 points)
  const lowerAnswer = (answer || "").toLowerCase();
  const hasTimeline = /\b(days|months|years|within \d+|limitation period)\b/i.test(lowerAnswer);
  const hasPenaltyOrRemedy = /\b(punish|imprisonment|fine|remedy|petition|bail|compensation|decree|order)\b/i.test(lowerAnswer);
  
  if (hasTimeline && hasPenaltyOrRemedy) {
    score += 10;
    factors.push("Includes specific timelines, statutory remedies, and legal penalties");
  } else if (hasTimeline || hasPenaltyOrRemedy) {
    score += 5;
    factors.push("Contains procedural remedy details");
  }

  // 4. Query Match Relevance
  const queryWords = (query || "").toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matchedWords = queryWords.filter(w => lowerAnswer.includes(w));
  const relevanceRatio = queryWords.length > 0 ? (matchedWords.length / queryWords.length) : 1;
  
  if (relevanceRatio > 0.6) {
    score += 5;
    factors.push("High alignment with specific legal query parameters");
  }

  // Clamp score between 15 and 98 (leaving realistic headroom)
  const finalScore = Math.max(15, Math.min(98, Math.round(score)));

  let label = "High Confidence";
  let badgeTitle = "Highly reliable answer";
  let badgeSub = "Answer is well supported by primary legal statutes and verified precedents";
  let color = "#22c55e";

  if (finalScore < 50) {
    label = "Low Confidence";
    badgeTitle = "Preliminary guidance";
    badgeSub = "Answer has limited citations. Please consult a licensed advocate.";
    color = "#ef4444";
  } else if (finalScore < 80) {
    label = "Medium Confidence";
    badgeTitle = "Moderately reliable answer";
    badgeSub = "Answer supported by statutory rules; further contextual verification recommended";
    color = "#f59e0b";
  }

  return {
    trust_score: finalScore,
    confidence_label: label,
    badge_title: badgeTitle,
    badge_sub: badgeSub,
    color,
    factors
  };
}
