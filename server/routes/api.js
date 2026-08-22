/**
 * REST API Routes for TrustRAG Legal Backend
 */

import express from "express";
import { processLegalQuery } from "../services/ragEngine.js";
import { sampleSuggestions, legalCategories, legalStatutes, landmarkCaseLaws } from "../data/legalKnowledgeBase.js";

const router = express.Router();

// In-memory stores for session persistence
let bookmarksStore = [];
const feedbackStore = [];

/**
 * Health Check
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TrustRAG Legal AI Backend",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

/**
 * Main Legal Query / Chat endpoint
 * POST /api/chat or POST /api/query
 */
router.post(["/chat", "/query"], async (req, res) => {
  try {
    const { question, query, category } = req.body;
    const userQuery = question || query;

    if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
      return res.status(400).json({ error: "Missing or invalid question parameter." });
    }

    const result = await processLegalQuery({
      query: userQuery.trim(),
      category: category || null
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error processing legal query:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while processing your legal query.",
      details: error.message
    });
  }
});

/**
 * Suggested queries
 * GET /api/suggestions?category=criminal
 */
router.get("/suggestions", (req, res) => {
  const { category } = req.query;
  let suggestions = [...sampleSuggestions];

  if (category) {
    const filteredStatutes = legalStatutes.filter(s =>
      s.category.toLowerCase().includes(category.toLowerCase())
    );
    if (filteredStatutes.length > 0) {
      const customSuggestions = filteredStatutes.map(s => `What are the provisions under ${s.section} of ${s.act}?`);
      suggestions = [...customSuggestions, ...suggestions].slice(0, 5);
    }
  }

  res.json({ success: true, suggestions });
});

/**
 * Supported legal categories
 * GET /api/categories
 */
router.get("/categories", (req, res) => {
  res.json({ success: true, categories: legalCategories });
});

/**
 * All Knowledge Base Sources
 * GET /api/sources
 */
router.get("/sources", (req, res) => {
  res.json({
    success: true,
    statutes: legalStatutes,
    cases: landmarkCaseLaws
  });
});

/**
 * Legal Document / Notice Analyzer
 * POST /api/documents/analyze
 */
router.post("/documents/analyze", async (req, res) => {
  try {
    const { text, documentType } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: "Please provide valid legal document text to analyze." });
    }

    const result = await processLegalQuery({ query: text.slice(0, 300) });

    res.json({
      success: true,
      analysis: {
        documentType: documentType || "Legal Notice / Contract",
        summary: `Document analyzed for Indian Legal compliance and statutory obligations.`,
        applicableSections: result.sources.map(s => `${s.title} (${s.subtitle})`),
        keyRisks: [
          "Check limitation period and mandatory statutory notice timelines.",
          "Verify jurisdiction and enforceability before execution or response."
        ],
        trust_score: result.trust_score,
        sources: result.sources,
        recommendedAction: result.answer
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Feedback Endpoint
 * POST /api/feedback
 */
router.post("/feedback", (req, res) => {
  const { messageId, query, rating, feedbackText } = req.body;

  const entry = {
    id: `fb-${Date.now()}`,
    messageId,
    query,
    rating: rating === "like" ? "like" : "dislike",
    feedbackText: feedbackText || "",
    timestamp: new Date().toISOString()
  };

  feedbackStore.push(entry);
  res.json({ success: true, message: "Thank you for your feedback!", entry });
});

/**
 * Bookmarks CRUD
 */
router.get("/bookmarks", (req, res) => {
  res.json({ success: true, bookmarks: bookmarksStore });
});

router.post("/bookmarks", (req, res) => {
  const { question, answer, trust_score, sources } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ error: "Invalid bookmark data" });
  }

  const newBookmark = {
    id: `bm-${Date.now()}`,
    question,
    answer,
    trust_score: trust_score || 85,
    sources: sources || [],
    savedAt: new Date().toISOString()
  };

  bookmarksStore.unshift(newBookmark);
  res.json({ success: true, bookmark: newBookmark });
});

router.delete("/bookmarks/:id", (req, res) => {
  const { id } = req.params;
  bookmarksStore = bookmarksStore.filter(b => b.id !== id);
  res.json({ success: true, message: "Bookmark removed" });
});

export default router;
