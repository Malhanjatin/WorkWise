import React, { useEffect, useState } from "react";
import {useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import "../pages/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {login,lastLogged} = useAuth();
  const [email, setEmail] = useState(lastLogged ? lastLogged.email : "");
  const [password, setPassword] = useState("");

 

const navigate= useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    const result =  await login(email, password);
     if(result.success){
      if( result.user &&result.user.role==="admin"){
         toast.success('Login successful Welcome Admin')
         navigate('/admin-dashBoard');
      }else{
      toast.success('Login successful')
        navigate('/dashBoard')
     }}
    else{
        toast.error( result.message || 'Invalid email or password')
    }
  };

  return (
    <>
      <div className="main">
        {/* 🌟 ADDED THE STYLISH WELCOME MESSAGE SECTION 🌟 */}
        <div className="welcome-message">
          <h1 className="welcome-title">Welcome to WorkWise</h1>
          <p className="welcome-tagline">A Productivity Tracker.</p>
        </div>
        
        <form className="container" onSubmit={handleSubmit}>
          
          {/* HEADING INSIDE THE BOX (Simplified now that the main title is outside) */}
          <h3 className="heading">Please Login!</h3>
          {/* Changed subtitle to be more descriptive */}
         
          
          {/* Email Input */}
          <input
            className="input"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            value={email}
            name="email"
            required
          />
          
          {/* Password Input */}
          <input
            className="input"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={password}
            name="password"
            required
          />
          
          {/* Forgot Password Link */}
          {/* <p className="paragraph forgot-password">
            Forget Password ?
          </p> */}
          <p className="paragraph forgot-password" onClick={() => navigate("/reset-password")}>
  Forget Password ?
</p>

          
          {/* Login Button */}
          <button className="btn" type="submit">
            Login
          </button>
          
          {/* Sign Up Link */}
         <p className="paragraph">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;