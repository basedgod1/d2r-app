import React, {useEffect, useState} from 'react';
import DirectoryInput from '../../components/DirectoryInput';
import Form from 'react-bootstrap/Form';
import './Config.css';

export default function Config() {

  const [gameDir, setGameDir] = useState('');
  const [gameDirStatus, setGameDirStatus] = useState('Verifying...');
  const [saveDir, setSaveDir] = useState('');
  const [saveDirStatus, setSaveDirStatus] = useState('Verifying...');
  const [loaded, setLoaded] = useState(false);
  const [verified, setVerified] = useState({});

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await window.api.getConfig();
        setGameDir(data.gameDir);
        setSaveDir(data.saveDir);
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
    }
  }, [loaded]);

  async function verifyGameDir() {
    try {
      const gameDirStatus = await window.api.verifyGameDir(gameDir);
      setGameDirStatus(gameDirStatus);
    } catch (e) {
      console.log(e);
    }
  }

  async function verifySaveDir() {
    try {
      const saveDirStatus = await window.api.verifySaveDir(saveDir);
      setSaveDirStatus(saveDirStatus);
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
      </Form>
    </div>
  );
}
