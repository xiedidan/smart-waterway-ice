import React, { Component } from 'react';
import { Input, Grid, Select, Button, DatePicker } from '@icedesign/base';
import DataBinder from '@icedesign/data-binder';
// form binder 详细用法请参见官方文档
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';
import * as CONSTS from '../../../../../consts';

const { Row, Col } = Grid;
const { Option } = Select;

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
export default class Filter extends Component {
  static displayName = 'Filter';

  componentDidMount() {
    this.props.updateBindingData('projectList', {
      data: {
        page: 1,
        pageSize: 100,
      },
    });
  }

  render() {
    const projects = this.props.bindingData.projectList.projects;

    return (
      <IceFormBinderWrapper
        value={this.props.value}
        onChange={this.props.onChange}
      >
        <div>
          <Row wrap>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>所属项目</label>
              <IceFormBinder>
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
            </Col>
            <Col xxs={24} xs={12} l={8} style={styles.filterCol}>
              <label style={styles.filterTitle}>类型</label>
              <IceFormBinder>
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
            </Col>
          </Row>
          <div
            style={{
              textAlign: 'left',
              marginLeft: '12px',
            }}
          >
            <Button onClick={this.props.onReset} type="normal">
              重置
            </Button>
            <Button
              onClick={this.props.onSubmit}
              type="primary"
              style={{ marginLeft: '10px' }}
            >
              确定
            </Button>
          </div>
        </div>
      </IceFormBinderWrapper>
    );
  }
}

const styles = {
  filterCol: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },

  filterTitle: {
    width: '68px',
    textAlign: 'right',
    marginRight: '12px',
    fontSize: '14px',
  },

  filterTool: {
    width: '200px',
  },
};
