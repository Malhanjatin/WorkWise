import React, { useState } from 'react'
import '../pages/signup.css'
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { toast } from 'react-toastify';
import { isValidEmail,isValidPassword } from '../utilis/validation';

 const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const {signup} = useAuth();
    const navigate = useNavigate()
    
    const handleChange =(e)=>{
        const {name, value} = e.target;

        if(name==="email") setEmail(value);
        if(name==='password') setPassword(value);
        if(name==='confirmPass') setConfirmPass(value)
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        
        if(!isValidEmail(email)){
              toast.error("Please enter a valid email");
                return;
        }
        const passwordRules = isValidPassword(password);
        const okPassword = Object.values(passwordRules).every(Boolean);

        if(!okPassword){
            toast.error('Password must be 8+ characters and include upper, lower, number, and special character')
            return
        }

        if(password!== confirmPass){
            toast.error("Passwords dont match");
            return;
        }

        const success = signup(email,password)
        if(success){
           toast.success('Account created successfully')
            navigate('/') // Navigate to login after successful signup
        }
        else{
            toast.error('User already exists')
        }
    }

  return (
    <div className='main'>
        {/* 🌟 STYLISH BRANDING MESSAGE 🌟 */}
        <div className="welcome-message">
            <h1 className="welcome-title">Welcome to WorkWise</h1>
            <p className="welcome-tagline">A Productivity Tracker.</p>
        </div>
        
        <form onSubmit={handleSubmit} className='container'>
            <h3 className='heading'>Create Your Account</h3>
            
            <input 
                className='input'
                type='email'
                placeholder='Email'
                value={email}
                name='email'
                onChange={handleChange}
                required
            />

            <input 
                className='input'
                type='password'
                placeholder='Password'
                value={password}
                name='password'
                onChange={handleChange}
                required
            />

            <input
                className='input'
                placeholder='Confirm Password'
                type='password'
                value={confirmPass}
                name='confirmPass'
                onChange={handleChange}
                required
            />
            <button className='btn' type='submit'>Signup</button>

            {/* Link back to login */}
            <p className="paragraph">
                Already have an account? <Link to="/">Login</Link>
            </p>
        </form>
    </div>
  )
}
export default Signup