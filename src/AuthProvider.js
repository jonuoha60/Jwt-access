import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage or null
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [email, setEmail] = useState(localStorage.getItem("email") || null);
  const [username, setUsername] = useState(localStorage.getItem("username") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [created, setCreated] = useState(localStorage.getItem("created") || null);
  const [firebaseUid, setFirebaseUid] = useState(localStorage.getItem("firebaseUid") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const [watchList, setWatchList] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : [];
  });
  const [ favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : [];
  }) 
  const [ratings, setRatings] = useState(() => {
    const stored = localStorage.getItem("ratings");
    return stored ? JSON.parse(stored) : [];
  });

  // login function to set the localStorage not wise security wise but for this demo use this
  const login = (token, username, email, userId, userDate, firebase) => {
    setToken(token);
    setEmail(email);
    setUsername(username);
    setUserId(userId);
    setCreated(userDate);
    setFirebaseUid(firebase);
    setIsAuthenticated(true);

    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("created", userDate);
    localStorage.setItem("firebaseUid", firebase);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("created");

    setToken(null);
    setEmail(null);
    setUsername(null);
    setUserId(null);
    setCreated(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        isAuthenticated,
        login,
        logout,
        username,
        userId,
        created,
        watchList,
        setToken,
        setWatchList,
        setFavorites,
        favorites,
        ratings,
        setRatings,
        firebaseUid
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
