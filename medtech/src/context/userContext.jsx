import React, { useEffect, useState } from 'react';

const UserContext = React.createContext(undefined);

function UserContextProvider({ children }) {
  const [user, setUser] = useState('');

  useEffect(() => {
    try {
      const userData =
        JSON.parse(localStorage.getItem('loggedInUser') ?? '') ?? '';

      if (userData) {
        setUser(userData);
      }
    } catch (e) {
      //
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }, [user]);

  function login(userName) {
    setUser(userName);
  }

  function logOut() {
    setUser('');
  }

  return (
    <UserContext.Provider value={{ user, login, logOut }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContextProvider, UserContext };
