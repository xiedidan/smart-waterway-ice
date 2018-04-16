/* eslint no-underscore-dangle: 0 */
import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import { Table, Pagination, Feedback, Icon } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import FilterForm from './Filter';

import EditorInfoDialog from './EditorInfoDialog';
import * as CONSTS from '../../../../consts';

const Toast = Feedback.toast;

@DataBinder({
  tableData: {
    url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/entities`,
    type: 'get',
    params: {
      page: 1,
    },
    defaultBindingData: {
      list: [],
      total: 100,
      pageSize: 10,
      currentPage: 1,
    },
    responseFormatter: (handler, res, oldRes) => {
      const newRes = {
        status: 'SUCCESS',
        data: {
          total: res._meta.totalCount,
          pageSize: res._meta.pageSize,
          currentPage: res._meta.page,

          list: res.entities.map((entity) => {
            const newEntity = _.cloneDeep(entity);
            newEntity.id = entity._id;
            newEntity.location = JSON.stringify(entity.location);
            newEntity.operation = {
              edit: true,
              delete: true,
            };
            newEntity.info = entity.info ? JSON.stringify(entity.info) : '{}';

            return newEntity;
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
    };
  }

  componentDidMount() {
    this.queryCache.page = 1;
    this.fetchData();
  }

  fetchData = () => {
    this.props.updateBindingData('tableData', {
      params: this.queryCache,
    });
  };

  editItem = (record, e) => {
    e.preventDefault();
    EditorInfoDialog.show({
      value: record,
      onOk: async (value) => {
        try {
          // 更新数据
          const resp = await axios.put(
            `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/entities/${record.id}`,
            {
              _id: value.id,
              name: value.name,
              project: value.project,
              user: value.user,
              access: Number(value.access),
              desc: value.desc,
              location: JSON.parse(value.location),
              type: Number(value.type),
              info: JSON.parse(value.info),
            },
            {
              withCredentials: true,
            }
          );

          if (resp.status === 200) {
            Toast.success('更新成功');
            return;
          }

          Toast.warning(resp.data);
        } catch (err) {
          Toast.error(err.toString());
        } finally {
          // 更新完成之后，可以重新刷新列表接口
          this.props.updateBindingData('tableData', {
            data: {
              page: 1,
            },
          });
          EditorInfoDialog.hide();
        }
      },
      onClose: () => {
        EditorInfoDialog.hide();
      },
      onCancel: () => {
        EditorInfoDialog.hide();
      },
    });
  };

  deleteItem = async (record, e) => {
    e.preventDefault();
    try {
      const resp = await axios.delete(
        `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/entities/${record.id}`,
        {
          withCredentials: true,
        }
      );

      if (resp.status === 200) {
        Toast.success('删除成功');
        return;
      }

      Toast.warning(resp.data);
    } catch (err) {
      Toast.error(err.toString());
    } finally {
      this.props.updateBindingData('tableData', {
        data: {
          page: 1,
        },
      });
    }
  };

  renderType = (value, index, record) => {
    let type = '';
    switch (record.type) {
      case 1:
        type = '航标';
        break;

      case 2:
        type = '水文';
        break;

      case 3:
        type = '气象';
        break;

      case 4:
        type = '船舶';
        break;

      case 5:
        type = '文档';
        break;

      default:
        type = '未知';
        break;
    }

    return (
      <span>{ type }</span>
    );
  };

  renderAccess = (value, index, record) => {
    let access = '';
    switch (record.access) {
      case 0:
        access = '公开';
        break;

      case 1:
        access = '保密';
        break;

      default:
        access = '未知';
        break;
    }

    return (
      <span>{ access }</span>
    );
  };

  renderOperations = (value, index, record) => {
    return (
      <div className="operation-table-operation" style={styles.operationTable}>
        <span
          onClick={this.editItem.bind(this, record)}
          title="编辑"
          style={styles.operBtn}
        >
          <Icon size="xs" type="edit" />
        </span>
        <span
          onClick={this.deleteItem.bind(this, record)}
          title="删除"
          style={styles.operBtn}
        >
          <Icon size="xs" type="close" />
        </span>
      </div>
    );
  };

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

    _.unset(this.queryCache, 'proejct');
    _.unset(this.queryCache, 'type');
  };

  render() {
    const tableData = this.props.bindingData.tableData;
    const { filterFormValue } = this.state;

    return (
      <div className="filter-table">
        <IceContainer title="内容筛选">
          <FilterForm
            value={filterFormValue}
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
          />
        </IceContainer>
        <IceContainer>
          <Table
            dataSource={tableData.list}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column
              title="标记名称"
              dataIndex="name"
              width={85}
            />
            <Table.Column
              title="项目"
              dataIndex="project.name"
              width={85}
            />
            <Table.Column
              title="用户"
              dataIndex="user.username"
              width={85}
            />
            <Table.Column
              title="类型"
              dataIndex="type"
              width={85}
              cell={this.renderType}
            />
            <Table.Column
              title="权限"
              dataIndex="access"
              width={85}
              cell={this.renderAccess}
            />
            <Table.Column
              title="描述"
              dataIndex="desc"
              width={150}
            />
            <Table.Column
              title="创建时间"
              dataIndex="createdAt"
              width={150}
            />
            <Table.Column
              title="更新时间"
              dataIndex="updatedAt"
              width={150}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={85}
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
  operBtn: {
    display: 'inline-block',
    width: '24px',
    height: '24px',
    borderRadius: '999px',
    color: '#929292',
    background: '#f2f2f2',
    textAlign: 'center',
    cursor: 'pointer',
    lineHeight: '24px',
    marginRight: '6px',
  },
  paginationWrapper: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
