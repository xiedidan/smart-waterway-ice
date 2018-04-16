/* eslint  react/no-string-refs: 0 */
import axios from 'axios';
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Grid, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import * as CONSTS from '../../../../consts';

const { Row, Col } = Grid;
const Toast = Feedback.toast;

export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        desc: '',
        geo: '',
      },
    };
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  checkGeo = (rule, values, callback) => {
    if (!values) {
      callback('请输入地理范围');
    } else {
      try {
        JSON.parse(values);
        callback();
      } catch (err) {
        callback(err.toString());
      }
    }
  };

  validateAllFormField = () => {
    this.refs.form.validateAll(async (errors, values) => {
      console.log('errors', errors, 'values', values);

      if (errors) {
        console.log('errors', errors);
        return;
      }

      try {
        // get current user
        const meResp = await axios.get(
          `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/users/me`,
          {
            withCredentials: true,
          }
        );

        if (meResp.status === 200) {
          const resp = await axios.post(
            `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/projects`,
            {
              name: values.name,
              desc: values.desc,
              geo: JSON.parse(values.geo),
              user: meResp.data._id,
            },
            {
              withCredentials: true,
            }
          );

          if (resp.status === 200) {
            Toast.success('添加成功');
            return;
          }

          Toast.warning(resp.data);
          return;
        }

        Toast.warning(meResp.data);
      } catch (err) {
        Toast.error(err.toString());
      }
    });
  };

  render() {
    return (
      <div className="settings-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>工程设置</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  工程名称：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required max={10} message="必填">
                    <Input size="large" placeholder="工程名称" />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  描述：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="desc">
                    <Input size="large" multiple placeholder="请输入描述..." />
                  </IceFormBinder>
                  <IceFormError name="desc" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  地理范围：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="geo">
                    <Input size="large" multiple placeholder="请输入地理范围(GeoJSON格式)..." />
                  </IceFormBinder>
                  <IceFormError name="geo" />
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
