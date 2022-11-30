import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../LoginContext/LoginContext";
import LockComponent from "../LockComponent/LockComponent";
import "./Homepage.css";

export default function Homepage() {
  const { email, setEmail, password, setPassword, login, loggedIn, setLoggedIn, locks, setLocks } =
    useLogin();


    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    useEffect(() => {
      if (!loggedIn) {
        navigate("/login");
      }
    }, [loggedIn, navigate]);

    useEffect(() => {
        if(locks.length < 1){
            getLocks();
        }
    })

    const getLocks = async () =>{
        if(loggedIn){
            setLoading(true);
            let url =
              "https://bike-lock-server.onrender.com/lock_id_availability";
            let response = await fetch(url, {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            });

            response = await response.json();
            console.log(response);
            
            setLocks([response]);
            setLoading(false);
        }
        

        //setLocks(response);
    }

    const logout = async () =>{
        setEmail("");
        setPassword("");
        setLoggedIn(false);
    }


  return (
    <div>


    {/*This header is blank. just has h2 text*/}
     <div className="Header">
        <h2>WatLock Admin Page</h2>
        <button id="button1" onClick={logout}>Logout</button>
     </div>
      
      <button className="refreshButton" onClick={getLocks}>Refresh Data</button>

      <hr></hr>

      {loading && (
        <div className="loadingDiv">
          <h3>Loading </h3>
          <img
            src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
            alt="loading"
            className="loadingIcon"
          ></img>
        </div>
      )}

      <ul>
        {locks &&
          locks.map((lock) => (
            <LockComponent data={lock} key={lock.lock_id}></LockComponent>
          ))}
      </ul>
    </div>
  );
}
