import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './features/login/Login';
import Home from './features/home/Home';
import Armory from './features/armory/Armory';
import Ladder from './features/ladder/Ladder';
import Config from './features/config/Config';
import Account from './features/account/Account';
import './App.css';

function App() {

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Config />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/armory" element={<Armory />} />
          <Route path="/ladder" element={<Ladder />} />
          <Route path="/config" element={<Config />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
