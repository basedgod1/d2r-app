import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import './FilterForm.css';

class FilterForm extends React.Component {

  constructor(props) {
      super(props);
      const updates = {};
      this.props.items.map(item => {
        if (typeof this.props.filter[item.key] === 'undefined' && typeof item.value !== 'undefined') {
          updates[item.key] = item.value;
          console.log('setting', item.key, item.value);
        }
      });
      this.props.setFilter({ ...this.props.filter, ...updates });
    }

    render() {
      return (
        <div>
          <h5>{this.props.title}</h5>
          <table>
            <tbody>
              {this.props.items.map((item, index) =>
                <tr key={index}>
                  <td>{item.key}</td>
                  <td>
                    <Form.Control value={this.props.filter[item.key] || ''} onInput={e => {
                      const updates = {};
                      updates[item.key] = e.target.value;
                      this.props.setFilter({ ...this.props.filter, ...updates });
                    }} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }
};

export default FilterForm;
