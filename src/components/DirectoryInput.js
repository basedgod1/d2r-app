import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import './DirectoryInput.css';

class DirectoryInput extends React.Component {

  constructor(props) {
      super(props);
      this.display = React.createRef();
      this.input = React.createRef();
      this.selectDirectory = this.selectDirectory.bind(this);
      this.directorySelected = this.directorySelected.bind(this);
    }

    selectDirectory() {
      this.input.current.click();
    }

    directorySelected(event) {
      if (event?.target?.files?.length) {
        let path = event.target.files[0].path
        path = path.slice(0, path.lastIndexOf('\\'));
        this.display.current.value = path;
        this.readFiles(path);
      }
    }

    readFiles(path) {
      console.log('reading files...', path);
    }

    render() {
      return (
        <React.Fragment>
          <Form.Label htmlFor="saved-games-dir">
            Saved Games Directory
          </Form.Label>
          <Form.Control
            id="saved-games-dir"
            aria-label="saved games directory input"
            placeholder="C:\Users\Username\Saved Games"
            ref={this.display}
            onClick={this.selectDirectory}
          />
          <input type="file" webkitdirectory="true"
            ref={this.input} onChange={this.directorySelected}
            id="saved-games-dir-input"
          />
        </React.Fragment>
      );
    }
};

export default DirectoryInput;
