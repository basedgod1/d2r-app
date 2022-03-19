import React, {useEffect, useState} from 'react';
import DirectoryInput from '../../components/DirectoryInput';
import Form from 'react-bootstrap/Form';
import './Config.css';

export default function Config() {

  const [gameDir, setGameDir] = useState('');
  const [gameDirStatus, setGameDirStatus] = useState('Verifying...');
  const [saveDir, setSaveDir] = useState('');
  const [saveDirStatus, setSaveDirStatus] = useState('Verifying...');
  const [bakDirs, setBakDirs] = useState([]);
  const [bakDirsStatus, setBakDirsStatus] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [verified, setVerified] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await window.api.getConfig();
        setGameDir(data.gameDir);
        setSaveDir(data.saveDir);
        setBakDirs(data.bakDirs);
        setLoaded(true);
      } catch (e) {
        console.log(e);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (loaded) {
      verifyGameDir();
      verifySaveDir();
      verifyBakDirs();
    }
  }, [loaded]);

  async function verifyGameDir() {
    try {
      const status = await window.api.verifyGameDir(gameDir);
      setGameDirStatus(status);
    } catch (e) {
      console.log(e);
    }
  }

  async function verifySaveDir() {
    try {
      const status = await window.api.verifySaveDir(saveDir);
      setSaveDirStatus(status);
    } catch (e) {
      console.log(e);
    }
  }

  async function verifyBakDirs() {
    try {
      const status = await window.api.verifyBakDirs(bakDirs);
      setBakDirsStatus(status);;
    } catch (e) {
      console.log(e);
    }
  }

  function onConfigChange(key, value) {
    console.log('onConfigChange', key, value);
    switch (key) {
      case 'gameDir':
        setGameDir(value);
        break;
      case 'saveDir':
        setSaveDir(value);
        break;
      case 'bakDirs':
        if (!bakDirs.includes(value)) {
          bakDirs.unshift(value);
          setBakDirs([...bakDirs]);
        }
        break;
    }
  }

  useEffect(() => {
    if (loaded) {
      (async () => {
        try {
          await window.api.setConfig('gameDir', gameDir);
        } catch (e) {
          console.log(e);
        }
      })();
      verifyGameDir();
    }
  }, [gameDir]);

  useEffect(() => {
    if (loaded) {
      (async () => {
        try {
          await window.api.setConfig('saveDir', saveDir);
        } catch (e) {
          console.log(e);
        }
      })();
      verifySaveDir();
    }
  }, [saveDir]);

  useEffect(() => {
    if (loaded) {
      (async () => {
        try {
          await window.api.setConfig('bakDirs', bakDirs);
        } catch (e) {
          console.log(e);
        }
      })();
      verifyBakDirs();
    }
  }, [bakDirs]);

  return (
    <div className="Config">
      <Form>
        <DirectoryInput
          controlId="gameDir"
          label="Game Directory"
          value={gameDir}
          onChange={onConfigChange}
        />
        {gameDirStatus}
        <br />
        <br />
        <br />
        <DirectoryInput
          controlId="saveDir"
          label="Save Directory"
          value={saveDir}
          onChange={onConfigChange}
        />
        {saveDirStatus}
        <br />
        <br />
        <br />
        <DirectoryInput
          controlId="bakDirs"
          label="Backup Directories"
          // value={bakDirs}
          onChange={onConfigChange}
        />
      {bakDirs.map((dir) =>
        <div key={dir} className="clearfix">
          <div className="bak-dir-cell rm-bak-dir" onClick={() => setBakDirs(bakDirs.filter((d) => d != dir))}>X</div>
          <div className="bak-dir-cell bak-dir-path">{dir}</div>
          <div className="bak-dir-status">{bakDirsStatus[dir] ? 'Verified' : `Unable to access ${dir}`}</div>
        </div>
      )}
      </Form>
    </div>
  );
}
