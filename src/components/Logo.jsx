import React, { PureComponent } from 'react';
import { Link } from 'react-router';

export default class Logo extends PureComponent {
  render() {
    return (
      <div className="logo" style={{}}>
        <Link to="/dashboard" className="logo-text">
          智能航道管理系统
        </Link>
      </div>
    );
  }
}
