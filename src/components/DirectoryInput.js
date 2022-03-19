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
        let path = event.target.files[0].path;
        path = path.slice(0, path.lastIndexOf('\\'));
        this.display.current.value = path;
        if (this.props.onChange) {
          this.props.onChange(this.props.controlId, path);
        }
      }
    }

    render() {
      return (
        <Form.Group className="mb-3" controlId={this.props.controlId}>
          <Form.Label>{this.props.label}</Form.Label>
          <Form.Control
            ref={this.display}
            value={this.props.value}
            onClick={this.selectDirectory}
            onChange={this.directorySelected}
          />
          <input type="file" webkitdirectory="true" className="d-none"
            ref={this.input} onChange={this.directorySelected}
          />
        </Form.Group>
      );
    }
};

export default DirectoryInput;
