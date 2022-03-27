import { useEffect, useState } from 'react';
import { AppContext } from '../../App';
import './Home.css';

function Home(props) {

  // console.log('render home');
  const api = window.api;
  const [log, setLog] = useState([]);

  useEffect(() => {
    api.onLogChange((_event, value) => {
      setLog(value);
    });
    setLog(api.getLog());
  }, []);

  return (
    <div className="Home">
      <div className="log">
        {log.map((entry) => <div key={entry.id}>{entry.ts} | {entry.msg}</div>)}
      </div>
      <a className="play" onClick={() => api.play()}>Play</a>
    </div>
  );
}

export default Home;
