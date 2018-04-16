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

const typeData = [
  { label: '普通用户', value: '0' },
  { label: '管理员', value: '1' },
];

class FormDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      value: props.value,
    };
  }

  onFormChange = (value) => {
    console.log(value)
    this.setState({
      value,
    });
  };

  onOkHandler = () => {
    this.props.onOk && this.props.onOk(this.state.value);
  };

  render() {
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
                <span style={styles.label}>角色</span>
              </Col>
              <Col span={18}>
                <IceFormBinder>
                  <Select
                    dataSource={typeData}
                    style={styles.formField}
                    name="role"
                  />
                </IceFormBinder>
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
