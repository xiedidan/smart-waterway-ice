import React, { Component } from 'react';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import FilterTable from './components/FilterTable';

export default class DocumentList extends Component {
  static displayName = 'DocumentList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const breadcrumb = [
      { text: '标记管理', link: '' },
      { text: '文档列表', link: '#/entity/document' },
    ];

    return (
      <div className="document-list-page">
        <CustomBreadcrumb dataSource={breadcrumb} />
        <FilterTable />
      </div>
    );
  }
}
