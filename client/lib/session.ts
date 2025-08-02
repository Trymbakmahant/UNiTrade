import { User } from "./api";

export interface SessionData {
  token: string;
  user: User;
  expiresAt: number;
}

export const SESSION_DURATION_DAYS = 5;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export const sessionUtils = {
  saveSession: (token: string, user: User) => {
    const sessionData: SessionData = {
      token,
      user,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
    localStorage.setItem("authToken", token); // Keep for backward compatibility
  },

  loadSession: (): SessionData | null => {
    try {
      const sessionStr = localStorage.getItem("sessionData");
      if (!sessionStr) return null;

      const session: SessionData = JSON.parse(sessionStr);

      // Check if session has expired
      if (Date.now() > session.expiresAt) {
        console.log("Session expired, clearing...");
        sessionUtils.clearSession();
        return null;
      }

      // Check if we have a valid token
      if (!session.token) {
        console.log("No token in session, clearing...");
        sessionUtils.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error("Failed to parse session data:", error);
      sessionUtils.clearSession();
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem("sessionData");
    localStorage.removeItem("authToken");
  },

  isSessionValid: (): boolean => {
    const session = sessionUtils.loadSession();
    return session !== null;
  },

  getSessionTimeRemaining: (): number => {
    const session = sessionUtils.loadSession();
    if (!session) return 0;
    return Math.max(0, session.expiresAt - Date.now());
  },

  getSessionExpiryDate: (): Date | null => {
    const session = sessionUtils.loadSession();
    if (!session) return null;
    return new Date(session.expiresAt);
  },

  formatTimeRemaining: (): string => {
    const timeRemaining = sessionUtils.getSessionTimeRemaining();
    if (timeRemaining === 0) return "Expired";

    const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ${hours} hour${
        hours > 1 ? "s" : ""
      }`;
    }
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  },

  // New method to update session with new token
  updateSessionToken: (newToken: string) => {
    const session = sessionUtils.loadSession();
    if (session) {
      session.token = newToken;
      session.expiresAt = Date.now() + SESSION_DURATION_MS;
      localStorage.setItem("sessionData", JSON.stringify(session));
      localStorage.setItem("authToken", newToken);
    }
  },
};
