import './App.css';
import Login from './components/login/Login';
import Homepage from './components/homepage/Homepage';

import { LoginProvider, useLogin } from "./components/LoginContext/LoginContext";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <LoginProvider>
          <Routes>
            <Route path="" element={<Login></Login>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/home" element={<Homepage></Homepage>}></Route>
          </Routes>
        </LoginProvider>
      </Router>
    </div>
  );
}

export default App;
