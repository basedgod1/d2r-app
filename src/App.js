import Form from 'react-bootstrap/Form';
import DirectoryInput from './components/DirectoryInput';
import './App.css';

function App() {
  return (
    <div className="App">
      <Form id="config-form">
        <Form.Group>
          <DirectoryInput/>
        </Form.Group>
      </Form>
    </div>
  );
}

export default App;
