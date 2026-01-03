import { useState, createContext, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    user_id: null,
    username: '',
    role: ''
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("userDetails");

      if (storedUser) {
          setUser(JSON.parse(storedUser));
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}