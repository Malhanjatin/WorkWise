import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

const getFromLocalStorage =(key,defaultValue)=>{
  const saved =localStorage.getItem(key);
  try{
    return saved ? JSON.parse(saved) :defaultValue;
  }
  catch(e){
    console.error(`Error parsing ${key} from localStorage:`,e)
    return  defaultValue;
  }

}



export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(()=> getFromLocalStorage('users',[]))

  const [user, setUser] = useState(() => getFromLocalStorage('user', null));
  const [lastLogged , setLastLogged] = useState(()=>getFromLocalStorage('lastloggeduser', null))


  useEffect(()=>{
localStorage.setItem('users', JSON.stringify(users))
  },[users])




  const signup = (email, password) => {
    const exists = users.find((u) => u.email === email);
    if (exists) return false;

    const newUser = { email, password };

    setUsers((prevUsers) => [...prevUsers, newUser]);

    // Set the new user as the currently logged-in user
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLastLogged(null);
    localStorage.removeItem('lastloggeduser');
    return true;
  };

  const login = (email, password) => {
    // Fixed: Now actually checks against stored users
    const found = users.find((u) => u.email === email && u.password === password);
    
   if (!found) return false;

    // Set the user in state and save the single user object to 'user' key
    setUser(found);
    localStorage.setItem("user", JSON.stringify(found));
    
    // Clear last credentials on successful login
    setLastLogged(null);
    localStorage.removeItem('lastloggeduser');

    return true;
  };

  const logOut = () => {
   if (user) {
        // Find the full user object (with password) from the 'users' list
        const credentialsToRemember = users.find(u => u.email === user.email);
        
        if (credentialsToRemember) {

          const emailOnly = {email:credentialsToRemember.email,password : ""}
            setLastLogged(emailOnly)
            // Save the full credentials to local storage (as requested)
            localStorage.setItem('lastloggeduser', JSON.stringify(emailOnly))
        }
    }
    
    // Perform the actual logout
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logOut, signup ,lastLogged,users,setUsers}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);