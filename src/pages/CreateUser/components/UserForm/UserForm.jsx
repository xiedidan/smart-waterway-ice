/* eslint react/no-string-refs:0 */
import axios from 'axios';
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Button, Select, Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './UserForm.scss';
import * as CONSTS from '../../../../consts';

const { Row, Col } = Grid;
const Toast = Feedback.toast;
export default class UserForm extends Component {
  static displayName = 'UserForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        username: '',
        password: '',
        password2: '',
        role: 0,
      },
    };
  }

  checkPasswd = (rule, values, callback) => {
    if (!values) {
      callback('请输入新密码');
    } else if (values.length < 2) {
      callback('密码必须大于2位');
    } else if (values.length > 32) {
      callback('密码必须小于32位');
    } else {
      callback();
    }
  };

  checkPasswd2 = (rule, values, callback, stateValues) => {
    console.log('stateValues:', stateValues);
    if (values && values !== stateValues.password) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll(async (errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }

      console.log('values:', values);
      try {
        const resp = await axios.post(
          `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/users`,
          {
            username: values.username,
            password: values.password,
            role: values.role,
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
      } catch (err) {
        Toast.error(err.toString());
      }
    });
  };

  render() {
    return (
      <div className="user-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>添加用户</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="3" style={styles.formLabel}>
                  用户名：
                </Col>
                <Col xxs="16" s="12" l="10">
                  <IceFormBinder name="username" required message="必填">
                    <Input size="large" placeholder="请输入用户名" />
                  </IceFormBinder>
                  <IceFormError name="username" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="3" style={styles.formLabel}>
                  角色：
                </Col>
                <Col xxs="16" s="12" l="10">
                  <IceFormBinder name="role">
                    <Select
                      size="large"
                      placeholder="请选择..."
                      dataSource={[
                        { label: '普通用户', value: '0' },
                        { label: '管理员', value: '1' },
                      ]}
                    />
                  </IceFormBinder>
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="3" style={styles.formLabel}>
                  新密码：
                </Col>
                <Col xxs="16" s="12" l="10">
                  <IceFormBinder
                    name="password"
                    required
                    validator={this.checkPasswd}
                  >
                    <Input
                      htmlType="password"
                      size="large"
                      placeholder="请重新输入新密码"
                    />
                  </IceFormBinder>
                  <IceFormError name="password" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="4" l="3" style={styles.formLabel}>
                  确认密码：
                </Col>
                <Col xxs="16" s="12" l="10">
                  <IceFormBinder
                    name="password2"
                    required
                    validator={(rule, values, callback) =>
                      this.checkPasswd2(
                        rule,
                        values,
                        callback,
                        this.state.value
                      )
                    }
                  >
                    <Input
                      htmlType="password"
                      size="large"
                      placeholder="两次输入密码保持一致"
                    />
                  </IceFormBinder>
                  <IceFormError name="password2" />
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
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
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    marginBottom: 25,
  },
  formLabel: {
    height: '32px',
    lineHeight: '32px',
    textAlign: 'right',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
