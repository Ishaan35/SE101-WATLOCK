//This context contains the functions needed to modify or create user data on the rds database.
import React, { useContext, useState, useEffect } from "react";
const LoginContext = React.createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function LoginProvider({ children }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [locks, setLocks] = useState([]);

  const login = async () =>{
    let url = "https://bike-lock-server.onrender.com/login";
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email:email,
        password: password
      }),
    });

    response = await response.json();
    if(response && response.error){
        console.log(response);
    }
    else if(response && response.email){
        setLoggedIn(true);
        setEmail(response.email);
        setPassword(response.password)
    }
  }

  const value = {
    email,
    setEmail,
    password,
    setPassword,
    login,
    loggedIn,
    setLoggedIn,
    locks,
    setLocks,
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}
