import React from "react";
import "../pages/adminDashBoard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdmindataChart from "./admindataChart";
import AdminLineChart from "./admindataLineChart";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(
            "https://workwisebackend.onrender.com/api/admin/totalUsers"
        );
        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.log("error in showing total users", error);
      }
    };
    fetchTotalUsers();
  }, []);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch(
            "https://workwisebackend.onrender.com/api/admin/activeUsers"
          );
          const data = await response.json();
        setActiveUsers(data.activeUsers);
      } catch (err) {
        console.log("error in fetching actibve users", err);
      }
    };
    fetchActiveUsers();
  }, []);
  const handleClick = async () => {
    await logOut();
    navigate("/");
  };
  return (
    <>
      <div className="admin-dash-div">
        <h2 className="admin-heading">Hi Jatin 😎 ! Welcome to Admin Pannel</h2>
        <button type="submit" onClick={handleClick} className="logout-btn">
          Logout
        </button>
        <div className="cards-container">
          <div className="user-count-card">
            <h3>Total Registered Users </h3>
            <p>{totalUsers}</p>
          </div>
          <div className="user-count-card">
            <h3>Total Active Users </h3>
            <p>{activeUsers}</p>
          </div>
        </div>
        <h4 className="admin-heading">
          Graphical Representation of Registered Users
        </h4>
        <div className="charts-wrapper">
          <div className="chart-container">
            <AdmindataChart />
          </div>
          <div className="chart-container">
            <AdminLineChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
