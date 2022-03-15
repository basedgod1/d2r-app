import DirectoryInput from '../../components/DirectoryInput';
import Form from 'react-bootstrap/Form';
import './Config.css';

export default function Config() {
  return (
    <div className="Config">
      <Form>
        <DirectoryInput label="Saved Games Directory" placeholder="C:\Users\Username\Saved Games" />
      </Form>
    </div>
  );
}
