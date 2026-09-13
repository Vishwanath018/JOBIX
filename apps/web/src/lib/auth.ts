const TOKEN_KEY = "jobix_access_token_v2";
const USER_KEY = "jobix_user_v2";

export function saveAuth(
  token: string,
  user: unknown,
  remember = true
) {
  if (typeof window === "undefined") return;

  clearAuth();

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function setAccessToken(
  token: string,
  remember = true
) {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);

  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem(TOKEN_KEY) ??
    sessionStorage.getItem(TOKEN_KEY)
  );
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const value =
    localStorage.getItem(USER_KEY) ??
    sessionStorage.getItem(USER_KEY);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  localStorage.removeItem("jobix_access_token");
  localStorage.removeItem("jobix_user");
  sessionStorage.removeItem("jobix_access_token");
  sessionStorage.removeItem("jobix_user");
}
