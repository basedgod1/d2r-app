import React, {useEffect, useState} from 'react';
import DirectoryInput from '../../components/DirectoryInput';
import Form from 'react-bootstrap/Form';
import './Config.css';

export default function Config() {

  const [config, setConfig] = useState({gameDir: '', gameDirStatus: 'Verifying...'});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await window.api.getConfig();
        setConfig({...config, ...data});
      } catch (e) {
        console.log(e);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const saveConfig = async () => {
      try {
        const data = await window.api.setConfig(config);
      } catch (e) {
        console.log(e);
      }
    };
    if (config.dirty) {
      saveConfig();
      config.dirty = false;
    }
  }, [config]);

  function configChange(key, value) {
    const update = {};
    update[key] = value;
    setConfig({...config, ...update, dirty: true});
    if (key == 'gameDir') {
      verifyGameDir(value);
    }
  }

  function verifyGameDir() {
    // window.api.verifyGameDir(config);
  }

  return (
    <div className="Config">
      <Form>
        <DirectoryInput
          controlId="gameDir"
          label="Game Directory"
          value={config.gameDir}
          onChange={configChange}
        />
        {config.gameDirStatus}
      </Form>
    </div>
  );
}
