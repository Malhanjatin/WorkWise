import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../pages/dashBoard.css";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import Task from "../components/Task";
import { toast } from "react-toastify";

const FALLBACK_QUOTES = [
  {
    content: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    content: "Focus on being productive instead of busy.",
    author: "Tim Ferriss",
  },
  {
    content:
      "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    content: "Do not wait for opportunity. Create it.",
    author: "George Bernard Shaw",
  },
  {
    content: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
];

const getRandomFallbackQuote = () => {
  const index = Math.floor(Math.random() * FALLBACK_QUOTES.length);
  return FALLBACK_QUOTES[index];
};

const DashBoard = () => {
  const { user, logOut, authFetch, setUser, isAuthChecking } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);
  const [dashboardReady, setDashboardReady] = useState(false);
  
  // Prevent multiple initializations
  const isInitialized = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthChecking && !user) {
      console.log("❌ No user detected, redirecting to login");
      navigate("/", { replace: true });
    }
  }, [user, isAuthChecking, navigate]);

  // Initialize dashboard data
  useEffect(() => {
    // Wait for auth checking to complete
    if (isAuthChecking) {
      console.log("⏳ Auth checking in progress...");
      return;
    }

    // Don't proceed if no user
    if (!user) {
      console.log("❌ No user, skipping dashboard init");
      return;
    }

    // Prevent double initialization
    if (isInitialized.current) {
      console.log("✓ Dashboard already initialized");
      return;
    }

    isInitialized.current = true;
    console.log("🚀 Initializing dashboard for:", user.email);

    const initializeDashboard = async () => {
      try {
        // Fetch dashboard data and quote in parallel
        const [authRes, quoteRes] = await Promise.all([
          authFetch("https://workwisebackend.onrender.com/api/auth/dashboard"),
          fetch("https://zenquotes.io/api/quotes").catch(() => null),
        ]);

        // Handle auth response
        if (!authRes || !authRes.ok) {
          console.error("❌ Dashboard auth failed");
          toast.error("Session expired. Please login again.");
          await logOut();
          navigate("/", { replace: true });
          return;
        }

        const authData = await authRes.json();
        console.log("✅ Dashboard auth successful");

        // Update user if server returned different data
        if (authData.user && authData.user.email !== user?.email) {
          console.log("🔄 Updating user data from server");
          setUser(authData.user);
        }

        // Handle quote response
        if (quoteRes && quoteRes.ok) {
          try {
            const quoteData = await quoteRes.json();
            if (quoteData?.length > 0) {
              setQuote({
                content: quoteData[0].q,
                author: quoteData[0].a,
              });
              console.log("✅ Quote loaded from API");
            } else {
              setQuote(getRandomFallbackQuote());
              console.log("📝 Using fallback quote");
            }
          } catch (error) {
            console.log("⚠️ Quote parse error, using fallback");
            setQuote(getRandomFallbackQuote());
          }
        } else {
          setQuote(getRandomFallbackQuote());
          console.log("📝 Quote API unavailable, using fallback");
        }

        setDashboardReady(true);
      } catch (error) {
        console.error("❌ Dashboard initialization error:", error);
        toast.error("Failed to load dashboard. Please try again.");
        await logOut();
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [isAuthChecking, user]); // Only re-run if these change

  const handleClick = async () => {
    try {
      await logOut();
      toast.success("Logout successful!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Show loading spinner while checking auth or initializing
  if (isAuthChecking || !dashboardReady) {
    return (
      <div className="ws-auth-loading">
        <div className="ws-auth-loading-content">
          <div className="ws-auth-loading-icon">🔐</div>
          <p className="ws-auth-loading-text">
            {isAuthChecking ? "Verifying authentication..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="ws-dashboard">
      <SideBar onLogout={handleClick} />

      <div className="ws-main">
        <TopBar userEmail={user?.email} />

        <div className="ws-content">
          <div className="ws-thought-title">☁️ THOUGHT OF THE DAY</div>

          {loading ? (
            <p style={{ opacity: "0.7" }}>Loading inspiration...</p>
          ) : quote ? (
            <>
              <blockquote className="ws-thought-quote">
                "{quote.content}"
              </blockquote>
              <div className="ws-thought-author">— {quote.author}</div>
            </>
          ) : (
            <p style={{ opacity: "0.7" }}>No quote available</p>
          )}
        </div>

        <div className="ws-task-card-container">
          <Task />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;