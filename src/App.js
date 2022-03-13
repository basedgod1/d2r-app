// import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Armory from './components/Armory';
import Ladder from './components/Ladder';
import Config from './components/Config';
import Account from './components/Account';
import './App.css';

function App() {

  // const [token, setToken] = useState();
  //
  // if(!token) {
  //   return <Login setToken={setToken}/>
  // }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Config/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/armory" element={<Armory/>}/>
          <Route path="/ladder" element={<Ladder/>}/>
          <Route path="/config" element={<Config/>}/>
          <Route path="/account" element={<Account/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
