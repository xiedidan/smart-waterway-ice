/* eslint no-unused-expressions: 0 */
import React, { Component } from 'react';
import { Dialog, Input, Select, Grid } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import DialogDecorator from './DialogDecorator';

const { Col, Row } = Grid;

class FormDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      value: props.value,
    };
  }

  onFormChange = (value) => {
    this.setState({
      value,
    });
  };

  onOkHandler = () => {
    this.props.onOk && this.props.onOk(this.state.value);
  };

  render() {
    console.log(this.state.value)
    return (
      <Dialog
        title="编辑数据"
        onClose={this.props.onClose}
        onCancel={this.props.onCancel}
        onOk={this.onOkHandler}
        visible={this.state.visible}
        style={{ width: 400 }}
      >
        <IceFormBinderWrapper
          value={this.state.value}
          onChange={this.onFormChange}
        >
          <div>
            <Row>
              <Col span={4}>
                <span style={styles.label}>工程名称</span>
              </Col>
              <Col span={18}>
                <IceFormBinder required message="必填">
                  <Input style={styles.formField} name="name" />
                </IceFormBinder>
                <IceFormError name="name" />
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <span style={styles.label}>描述</span>
              </Col>
              <Col span={18}>
                <IceFormBinder required message="必填">
                  <Input multiple={true} style={styles.formField} name="desc" />
                </IceFormBinder>
                <IceFormError name="desc" />
              </Col>
            </Row>
            <Row>
              <Col span={4}>
                <span style={styles.label}>地理范围</span>
              </Col>
              <Col span={18}>
                <IceFormBinder required max={20} message="必填">
                  <Input multiple={true} style={styles.formField} name="geo" />
                </IceFormBinder>
                <IceFormError name="geo" />
              </Col>
            </Row>
          </div>
        </IceFormBinderWrapper>
      </Dialog>
    );
  }
}

const styles = {
  row: {
    marginTop: '10px',
  },
  label: {
    lineHeight: '30px',
  },
  formField: {
    width: '100%',
  },
};

export default DialogDecorator(FormDialog);
