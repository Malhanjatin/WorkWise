import React, { useEffect, useState } from "react";
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
    content: "Discipline is choosing between what you want now and what you want most.",
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
  const { user, logOut, authFetch, setUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [authRes, quoteRes] = await Promise.all([
          authFetch("http://localhost:3001/api/auth/dashboard"),
          fetch("https://zenquotes.io/api/quotes").catch(() => null),
        ]);

        if (!authRes) {
          logOut();
          navigate("/");
          return;
        }

        const authData = await authRes.json();

        if (authData.user && authData.user.email !== user?.email) {
          setUser(authData.user);
        }

       if (quoteRes) {
  try {
    const quoteData = await quoteRes.json();
    if (quoteData?.length > 0) {
      setQuote({
        content: quoteData[0].q,
        author: quoteData[0].a,
      });
    } else {
      setQuote(getRandomFallbackQuote());
    }
  } catch {
    setQuote(getRandomFallbackQuote());
  }
} else {
  setQuote(getRandomFallbackQuote());
}
               
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        logOut();
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [authFetch, logOut, navigate, setUser, user]);

  const handleClick = async () => {
    await logOut();
      toast.success("Logout successful!");
    navigate("/");
  };

  return (
    <div className="ws-dashboard">
      <SideBar onLogout={handleClick} />

      <div className="ws-main">
        <TopBar userEmail={user?.email} />

        <div className="ws-content">
          <div className="ws-thought-title">☁️ THOUGHT OF THE DAY</div>

          {loading ? (
            <p style={{ opacity: "0.7" }}>Loading inspiration...</p>
          ) : (
            <>
              <blockquote className="ws-thought-quote">
                "{quote?.content}"
              </blockquote>
              <div className="ws-thought-author">
                — {quote?.author}
              </div>
            </>
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
