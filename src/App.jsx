import './App.css'
import Login from './pages/login'
import DashBoard from './pages/dashBoard'
import { Routes ,Route,Navigate} from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Signup from './pages/signup'
import Task from './components/Task'
import ResetPassword from './pages/ResetPassword'

function App() {
 const PrivateRoute= ({children})=>{
  const {user} = useAuth();
  return user ? children :<Navigate to='/'/>;
 }
  return (
    <>
      <Routes>
      <Route path='/' element={<Login/>}/>
         <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashBoard' element={
        <PrivateRoute>
 
        <DashBoard/>
      
        </PrivateRoute>
        } />

      
        </Routes> 
    </>
  )
}

export default App
