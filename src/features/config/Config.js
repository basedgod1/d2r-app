import React, {useEffect, useState} from 'react';
import DirectoryInput from '../../components/DirectoryInput';
import FilterForm from '../../components/FilterForm';
import Form from 'react-bootstrap/Form';
import ReactTooltip from 'react-tooltip';
import hbBlankExtra from '../../img/blank-extra.png';
import hbSuperiorOnly from '../../img/superior-only.png';
import hbSuperior from '../../img/superior.png';
import hbTriTone from '../../img/tri-tone.png';
import hbPink from '../../img/ÿcO.png';
import hbPurple from '../../img/ÿc;.png';
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
  const [filterId, setFilterId] = useState(0);
  const [prevFilterId, setPrevFilterId] = useState(0);
  const [filterHelp, setFilterHelp] = useState(1);
  const [filters, setFilters] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    // console.log('useEffect');
    const config = api.getConfig();
    // console.log('useEffect', config);
    setConfig({ ...config });
  }, []);

  useEffect(() => {
    // console.log('useEffect.config', loaded, config);
    if (!loaded && config.id) {
      setLoaded(true);
      setGameDir(config.gameDir);
      setSaveDir(config.saveDir);
      setBakDirs([...config.bakDirs]);
      setFilterId(config.filterId);
      setPrevFilterId(config.filterId);
      setFilterHelp(config.filterHelp);
      setFilters([...config.filters]);
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

  useEffect(() => {
    // console.log('useEffect.filterId', loaded, filterId, prevFilterId);
    if (loaded) {
      if (filterId == 'create') {


      }
      if (filterId != config.filterId) {
        try {
          // console.log('useEffect.filterId', 'updateConfig');
          api.updateConfig('filterId', filterId);
          setConfig({ ...config, filterId: filterId });
          filterId != 'create' && setPrevFilterId(filterId);
        }
        catch (e) {
          const entry = { msg: 'Error updating filter id', err: e.message };
          console.log(entry);
          api.log(entry);
        }
      }
    }
  }, [filterId]);

  useEffect(() => {
    // console.log('useEffect.filterHelp', filterHelp);
    if (loaded) {
      if (filterHelp != config.filterHelp) {
        try {
          // console.log('useEffect.filterHelp', 'updateConfig');
          api.updateConfig('filterHelp', filterHelp);
          setConfig({ ...config, filterHelp: filterHelp });
        }
        catch (e) {
          const entry = { msg: 'Error updating filter help', err: e.message };
          console.log(entry);
          api.log(entry);
        }
      }
    }
  }, [filterHelp]);

  useEffect(() => {

  }, [filter]);

  useEffect(() => {

  }, [filterName]);

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

  function onDirChange(key, value) {
    // console.log('onDirChange', key, value);
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

  function onFilterChange(event) {
    setFilterId(event.target.value);
  }

  function cancelNewFilter() {
    // console.log('cancelNewFilter', filterId, prevFilterId);
    setFilterId(prevFilterId);
  }

  function saveNewFilter() {
    console.log('saveNewFilter');
  }

  return (
    <div className="config">
      <Form className="config-form">
        <DirectoryInput
          controlId="gameDir"
          label="Game Directory"
          value={gameDir}
          onChange={onDirChange}
        />
        <span className={gameDirStatus.err ? 'text-danger' : 'text-success'}>{gameDirStatus.msg}</span>
        <br />
        <br />
        <br />
        <DirectoryInput
          controlId="saveDir"
          label="Save Directory"
          value={saveDir}
          onChange={onDirChange}
        />
        <span className={saveDirStatus.err ? 'text-danger' : 'text-success'}>{saveDirStatus.msg}</span>
        <br />
        <br />
        <br />
        <DirectoryInput
          controlId="bakDirs"
          label="Backup Directories"
          onChange={onDirChange}
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
        <br />
        <br />
        <Form.Group className="mb-3}" controlId="filterId">
          <Form.Label>Loot Filter</Form.Label>
          <Form.Select className="custom-select" value={filterId} onChange={onFilterChange}>
            <option value="0">None</option>
            <option value="create">Create New Filter</option>
            {filters.map(filter => <option value={filter.id}>{filter.name}</option>)}
          </Form.Select>
        </Form.Group>
      </Form>
      {filterId ? <div className="filter">
        <Form.Group className="mb-3 clearfix" controlId="filterName">
          <Form.Control value={filterName} onInput={e => setFilterName(e.target.value)} placeholder="Filter Name" />
        </Form.Group>
        <div className="filter-nav">
          <a className="filter-section" onclick="">General</a>
          <a className="filter-section" onclick="">Potions</a>
          <a className="filter-section" onclick="">Gear</a>
          <a className="filter-help" onclick=""><label for="help">Help</label></a>
          <Form.Check id="help" className="help-checkbox" type="checkbox" value={filterHelp} onChange={e => setFilterHelp(e.target.checked)} />
        </div>
        {filterHelp ? <div>
          <h1>Intro to Filters</h1>
          <p>Accomplished by overwriting labels in json files (item-names.json, item-nameaffixes.json).</p>
          <p>Let's say we've already added Witherstring to our Grail. We're no longer interested in Hunter's Bows, so we remove the Hunter's Bow label</p>
          <p><img className="hb-superior" src={hbSuperior} /> becomes <img className="hb-superior-only" src={hbSuperiorOnly} /> ... that's not going to work!</p>
          <p>We could remove the label for superior, but then we would no longe be able to distinguish any supperior item from its corresponding normal version.</p>
          <p>One answer is replacing quality affix labeles with colors, e.g. ÿcO (pink) for superior and ÿcT (sky blue) for low/damaged/cracked/crude</p>
          <p><img className="hb-superior" src={hbSuperior} /> becomes <img className="hb-superior-only" src={hbPink} /> ... neat</p>
          <p>Then when we remove the Hunter's Bow label <img className="hb-blank-extra" src={hbBlankExtra} /> ... much better!</p>
          </div> : null}
          {filterId == 'create' && <div>
          <FilterForm title="Quality Affixes" filter={filter} setFilter={setFilter} items={[{
            key: `Superior`, value: `ÿcO` // Pink
          },{
            key: `Low Quality`, value: `ÿcT` // Sky blue
          },{
            key: `Damaged`, value: `ÿcT`
          },{
            key: `Cracked`, value: `ÿcT`
          },{
            key: `Crude`, value: `ÿcT`
          }]}>
          </FilterForm>
          <div className="cancel-filter">
            Cancel
          </div>
          <div className="save-filter">
            Save
          </div>
        </div>}
      </div> : null}
    </div>
  );
}
