import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import OperationTable from './components/OperationTable';

export default class ProjectList extends Component {
  static displayName = 'ProjectList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '工程管理', link: '' },
      { text: '工程列表', link: '#/project/list' },
    ];
    return (
      <div className="project-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <OperationTable />
      </div>
    );
  }
}
