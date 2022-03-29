import { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import './Home.css';

function Home(props) {

  // console.log('render home');
  const api = window.api;
  const [log, setLog] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.onLogChange((_event, value) => {
      if (isMounted) setLog(value);
    });
    setLog(api.getLog());
    return () => { isMounted = false }
  }, []);

  return (
    <div className="Home">
      <div className="log">
        {log.map((entry) =>
          <div key={entry.id}>
            <span className={entry.err ? 'text-danger' : 'text-success'} data-tip={entry.err}>{entry.ts} | {entry.msg}</span>
            <ReactTooltip />
          </div>
        )}
      </div>
      <a className="play" onClick={() => api.play()}>Play</a>
    </div>
  );
}

export default Home;
