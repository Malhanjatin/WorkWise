import { useNavigate } from 'react-router-dom'
import '../pages/ResetPassword.css'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { isValidPassword ,isValidEmail} from '../utilis/validation';
import { toast } from 'react-toastify';

const ResetPassword = () => {

    const navigate = useNavigate();
    const {users, setUsers} = useAuth();
   const [email, setEmail] = useState("");
const [newPassword, setNewPassword] = useState("");


const handleSubmit = (e) => {
  e.preventDefault();
  if(!isValidEmail){
    toast.error("Invalid Email Format");
    return;
  }

  const passCheck = isValidPassword(newPassword);
   if (
      !passCheck.length ||
      !passCheck.upper ||
      !passCheck.lower ||
      !passCheck.number ||
      !passCheck.special
    ) {
      toast.error("Password must be at least 8 characters and include uppercase, lowercase, number and special character.");
      return;

    }



  const existingUser = users.find((u) => u.email === email);
  if (!existingUser) {
    toast.error("No account found with this email.");
    return;
  }

  const updatedUsers = users.map((u) =>
    u.email === email ? { ...u, password: newPassword } : u
  );

  setUsers(updatedUsers);
  localStorage.setItem("users", JSON.stringify(updatedUsers));

  toast.success("Password reset successful. Redirecting to Login...");

  setTimeout(() => {
    navigate("/");
  }, 1500);
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
          <h3 className="heading">Please Reset Password !</h3>
          {/* Changed subtitle to be more descriptive */}
         
          
          {/* Email Input */}
          <input
            className="input"
            type="email"
            placeholder="Email"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            name="email"
            required
          />
          
          {/* Password Input */}
          <input
            className="input"
            type="password"
            placeholder="newPassword"
            onChange={(e)=> setNewPassword(e.target.value)}
                        value={newPassword}
            name="newPassword"
            required
          />
     
          
          {/* Login Button */}
          <button className="btn" type="submit">
            ResetPassword
          </button>
          
         
        </form>
      </div>
    </>
  );
  
}

export default ResetPassword