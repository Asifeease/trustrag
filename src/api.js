const TIMEOUT_MS = 120_000;

/**
 * POST /api/ask → proxied to the FastAPI backend as /ask
 * Returns the flat JSON response from the backend.
 * Throws on network failure, HTTP error, or timeout.
 */
export async function askTrustRag(question, externalSignal) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  // If the caller passed a signal, forward its abort to our controller
  if (externalSignal) {
    externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let res;
  try {
    res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      throw new Error("Request timed out after 2 minutes.");
    }
    throw new Error("Cannot reach the TrustRAG backend. Is the API running?");
  }

  clearTimeout(timeout);

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch {
      // body wasn't JSON; keep the status text
    }
    throw new Error(detail);
  }

  return res.json();
}
