import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../pages/dashBoard.css";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import axios from 'axios'
import Task from "../components/Task";


const DashBoard = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState();
  

  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await axios.get('https://zenquotes.io/api/quotes');
        const data = await res.data;
        setQuote({
        content: data[0].q,
        author: data[0].a
      });
    }
      catch (err) {
        console.log("Error fetching quote", err);
       setQuote({
          content: "Stay positive. Work hard. Make it happen.",
          author: "WorkWise",
        });

      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
  }, []);

  const handleClick = () => {
    logOut();
    navigate("/");
  };
  return (
    <div className="ws-dashboard ">
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
              <div className="ws-thought-author">— {quote?.author}</div>

    
            </>

    
          )}
        </div>
<div className="ws-task-card-container"> {/* Optional: Add a container for styling */}
             <Task />
          </div>


      </div>
    </div>

   
  );
};

export default DashBoard;
