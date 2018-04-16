import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import SettingsForm from './components/SettingsForm';

export default class CreateEntity extends Component {
  static displayName = 'CreateEntity';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '标记管理', link: '' },
      { text: '添加标记', link: '#/entity/create' },
    ];
    return (
      <div className="create-entity-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <SettingsForm />
      </div>
    );
  }
}
