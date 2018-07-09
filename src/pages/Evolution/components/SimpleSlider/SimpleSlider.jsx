import React, { Component } from 'react';
import { observer } from 'mobx-react';
import IceContainer from '@icedesign/container';
import { Slider } from '@icedesign/base';

import * as CONSTS from '../../../../consts';

const slides = [
  {
    url: `${CONSTS.EVOLUTION_BASE_URL}/2013.png`,
    text: '2013',
  },
  {
    url: `${CONSTS.EVOLUTION_BASE_URL}/2014.png`,
    text: '2014',
  },
  {
    url: `${CONSTS.EVOLUTION_BASE_URL}/2015.png`,
    text: '2015',
  },
];

@observer
class SimpleSlider extends Component {
  static displayName = 'SimpleSlider';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const settings = {
      arrows: false,
      dots: false,
      fade: true,
    };

    // we must directly use mobx observable in component
    return (
      <IceContainer>
        <Slider {...settings} slickGoTo={this.props.store.currentPosition}>
          {slides.map((item, index) => (
            <div key={index}>
              <img src={item.url} alt={item.text} style={styles.itemImg} />
            </div>
          ))}
        </Slider>
      </IceContainer>
    );
  }
}

const styles = {
  itemImg: {
    width: '100%',
  },
};

export default SimpleSlider;
