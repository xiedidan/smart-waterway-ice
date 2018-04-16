import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import SettingsForm from './components/SettingsForm';

export default class CreateProject extends Component {
  static displayName = 'CreateProject';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '工程管理', link: '' },
      { text: '添加工程', link: '#/project/create' },
    ];
    return (
      <div className="create-project-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <SettingsForm />
      </div>
    );
  }
}
