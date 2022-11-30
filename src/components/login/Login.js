import React, { useEffect, useState } from "react";
import { useLogin } from "../LoginContext/LoginContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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
    <div className="login">
      <h1>Watlock Login</h1>
      <input className="input1" type="text" placeholder="Email" value={email} onChange={updateEmail}></input>
      <input className="input2" type="password" placeholder="Password" value={password} onChange={updatePassword}></input>
      <div>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
