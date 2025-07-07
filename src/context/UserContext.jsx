/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [photo, setPhoto] = useState(null); // base64 or URL
  
  return (
    <UserContext.Provider value={{ photo, setPhoto }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);