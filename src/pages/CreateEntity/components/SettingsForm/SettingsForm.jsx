/* eslint  react/no-string-refs: 0 */
import axios from 'axios';
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Select, Radio, Switch, Grid, Feedback } from '@icedesign/base';
import DataBinder from '@icedesign/data-binder';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import * as CONSTS from '../../../../consts';

const { Row, Col } = Grid;
const { Option } = Select;
const { Group: RadioGroup } = Radio;
const Toast = Feedback.toast;

@DataBinder({
  projectList: {
    url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/projects`,
    type: 'get',
    params: {
      page: 1,
      pageSize: 100,
    },
    defaultBindingData: {
      projects: [],
    },
    responseFormatter: (handler, res, oldRes) => {
      const newRes = {
        data: {
          projects: res.projects.map((project) => {
            const newProject = _.cloneDeep(project);
            newProject.id = project._id;
            newProject.name = project.name;

            return newProject;
          }),
        },
      };
      handler(newRes, oldRes);
    },
  },
})
export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        project: '',
        user: '',
        access: '0',
        desc: '',
        location: '',
        type: '',
        info: '{}',
      },
    };
  }

  componentDidMount() {
    this.props.updateBindingData('projectList', {
      data: {
        page: 1,
        pageSize: 100,
      },
    });
  }

  formChange = (value) => {
    console.log('value', value);
    this.setState({
      value,
    });
  };

  checkJson = (rule, values, callback) => {
    if (!values) {
      callback('请填写合法的JSON格式内容');
    }

    try {
      JSON.parse(values);
      callback();
    } catch (err) {
      callback(err.toString());
    }
  };

  validateAllFormField = () => {
    this.refs.form.validateAll(async (errors, values) => {
      if (errors) {
        console.log('errors', errors);
        return;
      }

      console.log('values:', values);
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
            `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/entities`,
            {
              name: values.name,
              project: values.project,
              user: meResp.data._id,
              access: Number(values.access),
              desc: values.desc,
              location: JSON.parse(values.location),
              type: Number(values.type),
              info: JSON.parse(values.info),
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
    const projects = this.props.bindingData.projectList.projects;

    return (
      <div className="settings-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>添加标记</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  标记名称：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required max={50} message="必填">
                    <Input size="large" placeholder="" />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  所属项目：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="project" required message="必填">
                    <Select
                      name="project"
                      placeholder="请选择"
                      style={styles.filterTool}
                    >
                      {
                        projects.map((project) => {
                          return <Option value={project.id} key={project.id}>{project.name}</Option>;
                        })
                      }
                    </Select>
                  </IceFormBinder>
                  <IceFormError name="project" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  类型：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="type" required message="必填">
                    <Select
                      name="type"
                      placeholder="请选择"
                      style={styles.filterTool}
                    >
                      <Option value="1" key="1">航标</Option>
                      <Option value="2" key="2">水文</Option>
                      <Option value="3" key="3">气象</Option>
                      <Option value="4" key="4">船舶</Option>
                      <Option value="5" key="5">文档</Option>
                    </Select>
                  </IceFormBinder>
                  <IceFormError name="type" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  权限：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="access" required message="必填">
                    <RadioGroup defaultValue="0">
                      <Radio value="0">公开</Radio>
                      <Radio value="1">保密</Radio>
                    </RadioGroup>
                  </IceFormBinder>
                  <IceFormError name="access" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  地理位置：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder
                    name="location"
                    validator={this.checkJson}
                    required
                  >
                    <Input size="large" multiple placeholder="请输入地理位置..." />
                  </IceFormBinder>
                  <IceFormError name="location" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  描述：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="desc" required message="必填">
                    <Input size="large" multiple placeholder="请输入描述..." />
                  </IceFormBinder>
                  <IceFormError name="desc" />
                </Col>
              </Row>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  附加信息(JSON)：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder
                    name="info"
                    validator={this.checkJson}
                    required
                  >
                    <Input size="large" multiple placeholder="请输入附加信息..." />
                  </IceFormBinder>
                  <IceFormError name="info" />
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
