/* eslint no-underscore-dangle: 0 */
import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import { Table, Pagination, Icon } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';

import EditorInfoDialog from './EditorInfoDialog';
import * as CONSTS from '../../../../consts';

@DataBinder({
  tableData: {
    url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/users`,
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
          list: res.users.map((user) => {
            const newUser = _.cloneDeep(user);
            newUser.id = user._id;
            newUser.operation = {
              edit: true,
              changePassword: true,
              delete: true,
            };

            return newUser;
          }),
        },
      };
      handler(newRes, oldRes);
    },
  },
})
export default class OperationTable extends Component {
  static displayName = 'OperationTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchData({
      page: 1,
    });
  }

  fetchData = ({ page }) => {
    this.props.updateBindingData('tableData', {
      data: {
        page,
      },
    });
  };

  renderRole = (value, index, record) => {
    return (
      <span>{record.role === 0 ? '普通用户' : '管理员'}</span>
    );
  };

  editItem = (record, e) => {
    e.preventDefault();
    EditorInfoDialog.show({
      value: record,
      onOk: async (value) => {
        // 更新数据
        const resp = await axios.put(
          `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/users/${record.id}`,
          value,
          {
            withCredentials: true,
          }
        );

        // 更新完成之后，可以重新刷新列表接口
        this.props.updateBindingData('tableData', {
          data: {
            page: 1,
          },
        });
        EditorInfoDialog.hide();
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
    await axios.delete(
      `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/users/${record.id}`,
      {
        withCredentials: true,
      }
    );

    this.props.updateBindingData('tableData', {
      data: {
        page: 1,
      },
    });
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
    this.fetchData({
      page: currentPage,
    });
  };

  render() {
    const tableData = this.props.bindingData.tableData;

    return (
      <div className="operation-table">
        <IceContainer style={styles.cardContainer}>
          <Table
            dataSource={tableData.list}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column title="用户名" dataIndex="username" width={85} />
            <Table.Column title="角色" cell={this.renderRole} width={85} />
            <Table.Column
              title="创建时间"
              dataIndex="createdAt"
              width={150}
            />
            <Table.Column
              title="更新时间"
              dataIndex="createdAt"
              width={150}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div style={styles.paginationContainer}>
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
  cardContainer: {
    padding: '10px 10px 20px 10px',
  },
  titleCol: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleText: {
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
  paginationContainer: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
