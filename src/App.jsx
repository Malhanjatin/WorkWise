import './App.css'
import Login from './pages/login'
import DashBoard from './pages/dashBoard'
import { Routes ,Route,Navigate} from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Signup from './pages/signup'
import Task from './components/Task'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/adminDashboard'

function App() {
   const {user} = useAuth();
 const PrivateRoute= ({children})=>{
 
  return user ? children :<Navigate to='/'/>;
 }
 const AdminRoute = ({children})=>{
if(!user || user.role !=="admin"){
  return <Navigate to="/dashBoard" />;
}
return children; // if they are admin go them to their children which down here handle admin dashboard
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
<Route path='/admin-dashBoard'  element={
  <AdminRoute>
<AdminDashboard />
  </AdminRoute>
}

/>
      
        </Routes> 
    </>
  )
}

export default App
