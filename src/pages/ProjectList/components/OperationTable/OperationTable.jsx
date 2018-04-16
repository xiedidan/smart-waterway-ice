/* eslint no-underscore-dangle: 0 */
import _ from 'lodash';
import axios from 'axios';
import React, { Component } from 'react';
import { Table, Pagination, Icon, Feedback } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';

import EditorInfoDialog from './EditorInfoDialog';
import * as CONSTS from '../../../../consts';

const Toast = Feedback.toast;

@DataBinder({
  tableData: {
    url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/projects`,
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
          list: res.projects.map((project) => {
            const newProject = _.cloneDeep(project);
            newProject.id = project._id;
            newProject.geo = JSON.stringify(project.geo);
            newProject.operation = {
              edit: true,
              delete: true,
            };

            return newProject;
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

  editItem = (record, e) => {
    e.preventDefault();
    EditorInfoDialog.show({
      value: record,
      onOk: async (value) => {
        try {
          // 更新数据
          const resp = await axios.put(
            `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/projects/${record.id}`,
            {
              _id: value.id,
              name: value.name,
              user: value.user,
              desc: value.desc,
              geo: JSON.parse(value.geo),
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
        `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/projects/${record.id}`,
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
            <Table.Column title="工程名称" dataIndex="name" width={85} />
            <Table.Column title="用户" dataIndex="user.username" width={85} />
            <Table.Column
              title="描述"
              dataIndex="desc"
              width={85}
            />
            <Table.Column
              title="地理范围"
              dataIndex="geo"
              width={320}
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
