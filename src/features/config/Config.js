import React, {useEffect, useState} from 'react';
import DirectoryInput from '../../components/DirectoryInput';
import Form from 'react-bootstrap/Form';
import './Config.css';

export default function Config() {

  const api = window.api;
  const [config, setConfig] = useState({});
  const [gameDir, setGameDir] = useState('');
  const [gameDirStatus, setGameDirStatus] = useState({});
  const [saveDir, setSaveDir] = useState('');
  const [saveDirStatus, setSaveDirStatus] = useState({});
  const [bakDirs, setBakDirs] = useState([]);
  const [bakDirsStatus, setBakDirsStatus] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // console.log('useEffect');
    const config = api.getConfig();
    // console.log('useEffect', config);
    setConfig(config);
  }, []);

  useEffect(() => {
    // console.log('useEffect.config', loaded, config);
    if (!loaded && config.id) {
      setLoaded(true);
      setGameDir(config.gameDir);
      setSaveDir(config.saveDir);
      setBakDirs([...config.bakDirs]);
    }
  }, [config]);

  useEffect(() => {
    // console.log('useEffect.gameDir', loaded, gameDir, config.gameDir);
    if (loaded) {
      if (gameDir != config.gameDir) {
        try {
          // console.log('useEffect.gameDir', 'updateConfig');
          api.updateConfig('gameDir', gameDir);
          setConfig({ ...config, gameDir: gameDir });
        }
        catch (e) {
          const entry = { msg: 'Error updating game directory', err: e.message };
          console.log(entry);
          api.log(entry);
        }
      }
      checkGameDir();
    }
  }, [gameDir]);

  useEffect(() => {
    // console.log('useEffect.saveDir', loaded, saveDir, config.saveDir);
    if (loaded) {
      if (saveDir != config.saveDir) {
        try {
          // console.log('useEffect.saveDir', 'updateConfig');
          api.updateConfig('saveDir', saveDir);
          setConfig({ ...config, saveDir: saveDir });
        }
        catch (e) {
          const entry = { msg: 'Error updating saved games directory', err: e.message };
          console.log(entry);
          api.log(entry);
        }
      }
      checkSaveDir();
    }
  }, [saveDir]);

  useEffect(() => {
    // console.log('useEffect.bakDirs', loaded, bakDirs, config.bakDirs);
    if (loaded) {
      if (JSON.stringify(bakDirs) != JSON.stringify(config.bakDirs)) {
        try {
          // console.log('useEffect.bakDirs', 'updateConfig');
          api.updateConfig('bakDirs', bakDirs);
          setConfig({ ...config, bakDirs: bakDirs });
        }
        catch (e) {
          const entry = { msg: 'Error updating backup directories', err: e.message };
          console.log(entry);
          api.log(entry);
        }
      }
      checkBakDirs();
    }
  }, [bakDirs]);

  async function checkGameDir() {
    // console.log('config.js checkGameDir');
    const res = await api.checkGameDir(gameDir);
    // console.log('config.js checkGameDir', res);
    setGameDirStatus({...res});
  }

  async function checkSaveDir() {
    // console.log('config.js checkSaveDir');
    const res = await api.checkSaveDir(saveDir);
    // console.log('config.js checkSaveDir', res);
    setSaveDirStatus({...res});
  }

  async function checkBakDirs() {
    // console.log('config.js checkBakDirs', bakDirs);
    const res = await api.checkBakDirs(bakDirs);
    // console.log('config.js checkBakDirs res', res);
    setBakDirsStatus(res);
  }

  function onConfigChange(key, value) {
    // console.log('onConfigChange', key, value);
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

  return (
    <div className="Config">
      <Form>
        <DirectoryInput
          controlId="gameDir"
          label="Game Directory"
          value={gameDir}
          onChange={onConfigChange}
        />
        <span className={gameDirStatus.err ? 'text-danger' : 'text-success'}>{gameDirStatus.msg}</span>
        <br />
        <br />
        <br />
        <DirectoryInput
          controlId="saveDir"
          label="Save Directory"
          value={saveDir}
          onChange={onConfigChange}
        />
        <span className={saveDirStatus.err ? 'text-danger' : 'text-success'}>{saveDirStatus.msg}</span>
        <br />
        <br />
        <br />
        <DirectoryInput
          controlId="bakDirs"
          label="Backup Directories"
          onChange={onConfigChange}
        />
        {bakDirsStatus.map((item) => /^[a-z]/i.test(item.dir) &&
          <div key={item.dir} className="clearfix">
            <div className="bak-dir-cell rm-bak-dir" onClick={() => setBakDirs(bakDirs.filter((d) => d != item.dir))}>X</div>
            <div className="bak-dir-cell bak-dir-path">{item.dir}</div>
            <div className="bak-dir-status">
              <span className={item.err ? 'text-danger' : 'text-success'}>{item.msg}</span>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
