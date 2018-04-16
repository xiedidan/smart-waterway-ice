import React, { Component } from 'react';

import Map from './components/Map';

import './Dashboard.scss';

export default class Dashboard extends Component {
  static displayName = 'Dashboard';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dashboard-page">
        <Map />
      </div>
    );
  }
}
