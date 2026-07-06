const SESSION_ID_KEY = "cpp_session_id";
const OPEN_TRACKED_KEY = "cpp_open_tracked";
const INTERACT_TRACKED_KEY = "cpp_interact_tracked";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

async function post(event: "open" | "interact") {
  const sessionId = getSessionId();
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, event }),
    });
  } catch {
    // best-effort analytics; ignore network failures
  }
}

export function trackOpen() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(OPEN_TRACKED_KEY)) return;
  localStorage.setItem(OPEN_TRACKED_KEY, "1");
  void post("open");
}

export function trackInteract() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(INTERACT_TRACKED_KEY)) return;
  localStorage.setItem(INTERACT_TRACKED_KEY, "1");
  void post("interact");
}
