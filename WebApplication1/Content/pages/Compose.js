import './css/compose.css';

import {Helmet} from 'react-helmet';
import _ from 'lodash';
import React, {Component} from 'react';
import Flex from 'react-flexview';
import redirect from '../lib/redirect';
import actions from '../actions';

//import Nav from '../components/common/Nav';
import {getUser, CompositionModel} from '../store';

export default class Compose extends Component {
  constructor() {
    super();
    this.state = {
      compositions: {},
      limit: 20,
    };
    this.puzzle = null;
  }
  
  handleCreateClick = (e) => {
    e.preventDefault();
    fetch('/drafts/create')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
        return response.json();
    }).catch(error => {
      console.log('Error: ', error);
    }).then(data => {
      const composition = new CompositionModel(`/drafts/${data.id}`);
      composition.initialize().then(() => {
        redirect(`/drafts/edit/${data.id}`);
      });
    });
  };

  render() {
     return (
      <div>
        <button onClick={this.handleCreateClick}>New</button>
      </div>
    );
  }
}
