import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './home/Home';
import React from 'react';
import Notify from './Notify';
import Dashboard from './Dashboard/Dashboard';
import Privateroute from './Privateroute';

function App() {
  // const navigate = useNavigate();

  let auth = localStorage.getItem('auth')
  // let userToken = JSON.parse(auth).token
  // console.log(JSON.parse(auth).token)
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={
          <Privateroute>
            <Dashboard />
          </Privateroute>

        } />
      </Routes>

      <Notify />
    </BrowserRouter>
  );
}

export default App;
