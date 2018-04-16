import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import FilterTable from './components/FilterTable';

export default class EntityList extends Component {
  static displayName = 'EntityList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '标记管理', link: '' },
      { text: '标记列表', link: '#/entity/list' },
    ];
    return (
      <div className="entity-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <FilterTable />
      </div>
    );
  }
}
