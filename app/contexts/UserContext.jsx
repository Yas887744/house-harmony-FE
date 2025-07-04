import { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 3,
    created_at: '2025-06-02T09:52:05.771079+00:00',
    user_name: 'Kiran',
    group_name: 'House Harmony Rd',
    image_url: 'https://ca.slack-edge.com/T01KPE0QGCD-U089C313VM4-02359cc6e721-512',
    is_admin: true,
    badges_earned: null,
    points: 75,
  });

  // const logIn = (event) => {
  //   event.preventDefault();
  //   setUser((prevUser) => ({
  //        id: 1,
  //  created_at: '2025-06-02T09:52:05.771079+00:00',
  //  user_name: 'Kiran',
  //  group_name: 'House Harmony Rd',
  //  image_url: '',
  //  is_admin: true,
  //  badges_earned: null
  //   }));
  //   };

  //   const logOut = (event) => {
  //     event.preventDefault();
  //     setUser(defaultUser);
  //   };

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const useUserContext = () => useContext(UserContext);
