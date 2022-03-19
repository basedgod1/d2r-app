import './Home.css';

function Home() {
  return (
    <div className="Home">
      <div className="log">
      </div>
      <a className="play" onClick={() => window.api.play()}>Play</a>
    </div>
  );
}

export default Home;
