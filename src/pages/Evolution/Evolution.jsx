import React, { Component } from 'react';
import SimpleSlider from './components/SimpleSlider';
import SimpleTimeline from './components/SimpleTimeline';

export default class Evolution extends Component {
  static displayName = 'Evolution';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="evolution-page">
        <SimpleSlider />
        <SimpleTimeline />
      </div>
    );
  }
}
