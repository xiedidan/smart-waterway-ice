/* eslint no-underscore-dangle: 0 */
import _ from 'lodash';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Table, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import FilterForm from './Filter';

import * as CONSTS from '../../../../consts';

@observer
@DataBinder({
  tableData: {
    // 详细请求配置请参见 https://github.com/axios/axios
    url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/entities/status`,
    type: 'get',
    params: {
      page: 1,
      pageSize: 20,
    },
    defaultBindingData: {
      documents: [],
      total: 100,
      pageSize: 10,
      currentPage: 1,
    },
    responseFormatter: (handler, res, oldRes) => {
      const newRes = {
        data: {
          documents: res.results.map((result) => {
            const doc = {
              entityName: result.entity.name,
              entityDesc: result.entity.desc,
              projectId: result.entity.project,
              updatedAt: result.entity.updatedAt,
              designs: result.data.designs,
            };

            return doc;
          }),
          total: res['_meta'].totalCount,
          pageSize: res['_meta'].pageSize,
          currentPage: res['_meta'].page,
        },
      };

      handler(newRes, oldRes);
    },
  },
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
export default class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    // 请求参数缓存
    this.queryCache = {};
    this.state = {
      filterFormValue: {},
      selectedProject: '',
    };
  }

  async componentDidMount() {
    // init project list and select the last project
    this.fetchProjectList(() => {
      this.setState({
        selectedProject: this.props.bindingData.projectList.projects[0].id
      });

      // ok, fetch entites
      this.queryCache.page = 1;
      this.queryCache.pageSize = 20;
      // this.queryCache.project = this.state.selectedProject;
      this.queryCache.type = [5];

      this.fetchData(() => {
        console.log(this.props.bindingData.tableData.results);
      });
    });
  }

  fetchProjectList = (callback) => {
    this.props.updateBindingData('projectList',
      {
        params: {
          page: 1,
          pageSize: 100,
        },
      },
      callback
    );
  }

  fetchData = (callback) => {
    this.props.updateBindingData('tableData', {
      params: this.queryCache,
      callback,
    });
  };

  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };

  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    const designUrls = value.map((curr, index) => {
      const source = `${CONSTS.DOCUMENT_DESIGN_URL}/${curr}`;
      if (index === 0) {
        return (<div><a href={source} style={styles.operationItem}>{curr}</a></div>);
      }

      return (<div><br /><a href={source} style={styles.operationItem}>{curr}</a></div>);
    });

    return (
      <div
        className="filter-table-operation"
        style={styles.filterTableOperation}
      >
        { designUrls }
      </div>
    );
  };

  renderProject = (projectId) => {
    const projectName = this.props.bindingData.projectList.projects.reduce((prev, curr) => {
      if (curr._id === projectId) {
        return curr.name;
      }

      return prev;
    }, '');

    return projectName;
  }

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

    this.fetchData();
  };

  filterFormChange = (value) => {
    this.setState({
      filterFormValue: value,
    });
  };

  filterTable = () => {
    // 合并参数，请求数据
    this.queryCache = {
      ...this.queryCache,
      ...this.state.filterFormValue,
    };
    this.fetchData();
  };

  resetFilter = () => {
    this.setState({
      filterFormValue: {},
    });
  };

  render() {
    const tableData = this.props.bindingData.tableData;
    const { filterFormValue } = this.state;

    return (
      <div className="filter-table">
        {
        /*
        <IceContainer title="文档筛选">
          <FilterForm
            value={filterFormValue}
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
            projects={this.props.bindingData.projectList.projects}
          />
        </IceContainer>
        */
        }
        <IceContainer>
          <Table
            dataSource={tableData.documents}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column title="名称" dataIndex="entityName" width={85} />
            <Table.Column
              title="项目"
              dataIndex="projectId"
              width={160}
              cell={this.renderProject}
            />
            <Table.Column
              title="描述"
              dataIndex="entityDesc"
              width={85}
            />
            <Table.Column
              title="更新时间"
              dataIndex="updatedAt"
              width={160}
            />
            <Table.Column
              title="下载"
              dataIndex="designs"
              width={300}
              cell={this.renderOperations}
            />
          </Table>
          <div style={styles.paginationWrapper}>
            <Pagination
              current={tableData.currentPage}
              pageSize={tableData.pageSize}
              total={tableData.total}
              onChange={this.changePage}
            />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  filterTableOperation: {
    lineHeight: '28px',
  },
  operationItem: {
    marginRight: '12px',
    textDecoration: 'none',
    color: '#5485F7',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px',
  },
  paginationWrapper: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
