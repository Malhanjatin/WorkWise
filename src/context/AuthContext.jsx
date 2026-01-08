import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

const getFromLocalStorage = (key, defaultValue) => {
  if (typeof window === "undefined") return defaultValue;
  const saved = localStorage.getItem(key);
  try {
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    return defaultValue;
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() =>
    getFromLocalStorage("users", [])
  );
  const [user, setUser] = useState(() =>
    getFromLocalStorage("user", null)
  );
  const [lastLogged, setLastLogged] = useState(() =>
    getFromLocalStorage("lastloggeduser", null)
  );

  // ---------------- SYNC LOCAL STORAGE ----------------
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // ---------------- HELPERS ----------------
  const getAccessToken = () => localStorage.getItem("accessToken");

  // ---------------- SIGNUP ----------------
  const signup = async (email, password, confirmPassword) => {
    try {
      const response = await fetch(
        "https://workwisebackend.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) return { success: true };

      return {
        success: false,
        message:
          data.message ||
          (data.errors && data.errors[0].msg) ||
          "Signup failed",
      };
    } catch (error) {
      return {
        success: false,
        message: "Server connection failed",
        error: error.message,
      };
    }
  };

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // refresh token cookie
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("accessToken", data.accessToken);
        setLastLogged(null);
        localStorage.removeItem("lastloggeduser");
        return { success: true };
      }

      return {
        success: false,
        message:
          data.message ||
          (data.errors && data.errors[0].msg) ||
          "Login failed",
      };
    } catch (error) {
      return {
        success: false,
        message: "Server connection failed",
        error: error.message,
      };
    }
  };

  // ---------------- LOGOUT ----------------
  const logOut = async () => {
    if (user) {
      const emailOnly = { email: user.email, password: "" };
      setLastLogged(emailOnly);
      localStorage.setItem(
        "lastloggeduser",
        JSON.stringify(emailOnly)
      );
    }

    try {
      await fetch("https://workwisebackend.onrender.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setUser(null);
    localStorage.removeItem("accessToken");
  };

  // ---------------- REFRESH TOKEN ----------------
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        "https://workwisebackend.onrender.com/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        await logOut();
        return null;
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      await logOut();
      return null;
    }
  };

  // ---------------- AUTH FETCH (CORE) ----------------
  const authFetch = async (url, options = {}) => {
    let token = getAccessToken();

    let response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    // If access token expired
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;

      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
        credentials: "include",
      });
    }

    return response;
  };

  // ---------------- AUTO REFRESH ON LOAD ----------------
  useEffect(() => {
    if (user && !getAccessToken()) {
      refreshAccessToken();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logOut,
        signup,
        lastLogged,
        users,
        setUsers,
        refreshAccessToken,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
