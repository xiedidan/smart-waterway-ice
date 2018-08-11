import React, { Component } from 'react';
import { observer } from 'mobx-react';
import SimpleSlider from './components/SimpleSlider';
import LiteTable from './components/LiteTable';
import evolutionStore from '../../stores/EvolutionStore';
import { Step } from '@icedesign/base';
import IceContainer from '@icedesign/container';

const steps = ['2013', '2014', '2015'].map(
  (item, index) => <Step.Item key={index} title={item} />
);

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
        <IceContainer>
          <Step current={evolutionStore.currentPosition} type="dot">
            {steps}
          </Step>
        </IceContainer>
        <LiteTable store={evolutionStore} />
      </div>
    );
  }
}

export default Evolution;
