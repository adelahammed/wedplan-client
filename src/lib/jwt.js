export async function fetchAuthToken(user) {
  if (!user || !user.email) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        role: user.role,
        id: user.id || user._id,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("wedplan_token", data.token);
      }
      return data.token;
    }
    return null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("wedplan_token") || "";
}

export function removeStoredToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("wedplan_token");
  }
}

export function getAuthHeaders() {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
