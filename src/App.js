import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './features/login/Login';
import Home from './features/home/Home';
import Forums from './features/forums/Forums';
import Ladder from './features/ladder/Ladder';
import Config from './features/config/Config';
import Account from './features/account/Account';
import './App.css';

function App() {

  let AppContext = createContext();
  const [account, setAccount] = useState({});
  const [config, setConfig] = useState({});
  const [log, setLog] = useState([]);
  const api = window.api;
  const service = window.service;

  useEffect(() => {
    const init = async () => {
      setLog(['Initializing...']);
      setAccount({...api.getAccount()});
      setConfig({...api.getConfig()});
    };
    init();
  }, []);

  // useEffect(() => {
  //   if (account.verified) {
  //     console.log('account verified', account);
  //   }
  // }, [account.verified]);
  // setTimeout(() => setAccount({...account, verified: true}), 3000);

  return (
    <div className="wrapper">
      <AppContext.Provider value={[account, setAccount, config, setConfig, log, setLog]}>
        <BrowserRouter>
          <div className="header clearfix">
            <ul className="header-items">
              <li className="header-item"><Link to="/home">Home</Link></li>
              <li className="header-item"><Link to="/forums">Forums</Link></li>
              <li className="header-item"><Link to="/ladder">Ladder</Link></li>
              <li className="header-item"><Link to="/config">Config</Link></li>
              <li className="header-item"><Link to="/account">{account.verified ? account.name : 'Account'}</Link></li>
            </ul>
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/forums" element={<Forums />} />
            <Route path="/ladder" element={<Ladder />} />
            <Route path="/config" element={<Config />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
