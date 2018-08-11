import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table } from '@icedesign/base';

export default class LiteTable extends Component {
  static displayName = 'LiteTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      tableData: [
        {
          project: '长江干线水富-宜宾段',
          location: '104.40007209777832, 28.643773290949795',
          time: '2005.06.10',
        },
        {
          project: '长江干线水富-宜宾段',
          location: '104.40007209777832, 28.643773290949795',
          time: '2014.04.26',
        },
        {
          project: '长江干线水富-宜宾段',
          location: '104.40007209777832, 28.643773290949795',
          time: '2015.11.25',
        },
      ],
    };

    this.hoverHandler = this.hoverHandler.bind(this);
  }

  hoverHandler(record, index, e) {
    this.props.store.setPosition(index);
    console.log(this.props.store.currentPosition);
  }

  render() {
    const { tableData } = this.state;
    return (
      <div className="lite-table">
        <IceContainer>
          <Table dataSource={tableData} hasBorder={false} onRowMouseEnter={this.hoverHandler}>
            <Table.Column title="工程名称" dataIndex="project" width={100} />
            <Table.Column title="位置坐标" dataIndex="location" width={200} />
            <Table.Column title="时间" dataIndex="time" width={100} />
          </Table>
        </IceContainer>
      </div>
    );
  }
}
