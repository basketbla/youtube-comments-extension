import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import React, { 
  useContext,
  useState,
  useEffect
} from 'react';
import { auth } from '../utils/firebase'

const AuthContext = React.createContext();

// This is just a wrapper so it looks cleaner when we use the auth context
export function useAuth() { 
  return useContext(AuthContext);
}

// Welp. Couldn't think of a better way so I'm copying and pasting the context way that I did for app ideas.
export function AuthProvider({ children }) { 

  const [currentUser, setCurrentUser] = useState();

  function login(auth, provider) {
    return signInWithPopup(auth, provider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    })

    return unsubscribe;
  }, [])

  const value = {
    currentUser,
    login,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
