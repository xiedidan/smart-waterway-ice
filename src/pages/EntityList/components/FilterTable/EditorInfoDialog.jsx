/* eslint no-unused-expressions: 0 */
import React, { Component } from 'react';
import { Dialog, Input, Radio, Select, Grid } from '@icedesign/base';
import DataBinder from '@icedesign/data-binder';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import DialogDecorator from './DialogDecorator';
import * as CONSTS from '../../../../consts';

const { Col, Row } = Grid;
const { Option } = Select;
const { Group: RadioGroup } = Radio;

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
class FormDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible,
      value: props.value,
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

  onFormChange = (value) => {
    this.setState({
      value,
    });
  };

  onOkHandler = () => {
    this.props.onOk && this.props.onOk(this.state.value);
  };

  render() {
    const projects = this.props.bindingData.projectList.projects;

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
            <Row style={styles.formItem}>
              <Col span={6} style={styles.label}>
                标记名称：
              </Col>
              <Col span={18}>
                <IceFormBinder name="name" required max={50} message="必填">
                  <Input size="large" placeholder="" />
                </IceFormBinder>
                <IceFormError name="name" />
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col span={6} style={styles.label}>
                所属项目：
              </Col>
              <Col span={18}>
                <IceFormBinder name="project" required message="必填">
                  <Select
                    name="project"
                    placeholder="请选择"
                    style={styles.filterTool}
                    value={this.state.value.project._id}
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
              <Col span={6} style={styles.label}>
                类型：
              </Col>
              <Col span={18}>
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
                    <Option value="6" key="6">信息</Option>
                  </Select>
                </IceFormBinder>
                <IceFormError name="type" />
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col span={6} style={styles.label}>
                权限：
              </Col>
              <Col span={18}>
                <IceFormBinder name="access" required message="必填">
                  <RadioGroup value={this.state.value.access.toString()}>
                    <Radio value="0">公开</Radio>
                    <Radio value="1">保密</Radio>
                  </RadioGroup>
                </IceFormBinder>
                <IceFormError name="access" />
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col span={6} style={styles.label}>
                地理位置：
              </Col>
              <Col span={18}>
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
              <Col span={6} style={styles.label}>
                描述：
              </Col>
              <Col span={18}>
                <IceFormBinder name="desc" required message="必填">
                  <Input size="large" multiple placeholder="请输入描述..." />
                </IceFormBinder>
                <IceFormError name="desc" />
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col span={6} style={styles.label}>
                附加信息(JSON)：
              </Col>
              <Col span={18}>
                <IceFormBinder
                  name="info"
                  validator={this.checkJson}
                  required
                >
                  <Input size="large" multiple placeholder="请输入附加信息..." value={this.state.value.info} />
                </IceFormBinder>
                <IceFormError name="info" />
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

export default DialogDecorator(FormDialog);
