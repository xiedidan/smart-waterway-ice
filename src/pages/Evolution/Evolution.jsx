import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SimpleSlider from './components/SimpleSlider';
import LiteTable from './components/LiteTable';
import evolutionStore from '../../stores/EvolutionStore';

@observer
class Evolution extends Component {
  static displayName = 'Evolution';

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="evolution-page">
        <SimpleSlider store={evolutionStore} />
        <LiteTable store={evolutionStore} />
      </div>
    );
  }
}

export default Evolution;
