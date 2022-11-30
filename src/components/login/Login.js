import React, { useEffect, useState } from "react";
import { useLogin } from "../LoginContext/LoginContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { email, setEmail, password, setPassword, login, loggedIn } = useLogin();

    let navigate = useNavigate();

    useEffect(() =>{
        if(loggedIn){
            navigate("/home");
        }
    }, [loggedIn])
  

  const updateEmail = (e) => {
    setEmail(e.target.value)
  };
  const updatePassword= (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <h1>Login</h1>
      <input type="text" value={email} onChange={updateEmail}></input>
      <input type="password" value={password} onChange={updatePassword}></input>
      <button onClick={login}>Login</button>
    </div>
  );
}
