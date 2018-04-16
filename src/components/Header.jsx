import React, { PureComponent } from 'react';
import { Balloon, Icon } from '@icedesign/base';
import IceImg from '@icedesign/img';
import Layout from '@icedesign/layout';
import Menu from '@icedesign/menu';
import FoundationSymbol from 'foundation-symbol';
import cx from 'classnames';
import { Link } from 'react-router';
import DataBinder from '@icedesign/data-binder';
import { headerNavs } from '../navs';
import Logo from './Logo';
import * as CONSTS from '../consts';

@DataBinder({
  me: {
    url: `${CONSTS.BACKEND_BASE_URL}/api/${CONSTS.API_VERSION}/users/me`,
    type: 'get',
    withCredentials: true,
    defaultBindingData: {
      username: '',
      role: 0,
    },
    responseFormatter: (handler, res, oldRes) => {
      const newRes = {
        status: 'SUCCESS',
        data: res,
      };
      handler(newRes, oldRes);
    },
  },
})
export default class Header extends PureComponent {
  componentDidMount() {
    this.props.updateBindingData('me');
  }

  render() {
    const { width, theme, isMobile, className, style, ...others } = this.props;
    const me = this.props.bindingData.me;

    return (
      <Layout.Header
        {...others}
        theme={theme}
        className={cx('ice-design-layout-header', className)}
        style={{ ...style, width }}
      >
        <Logo />
        <div
          className="ice-design-layout-header-menu"
          style={{ display: 'flex' }}
        >
          {/* Header 菜单项 begin */}
          {headerNavs && headerNavs.length > 0 ? (
            <Menu mode="horizontal" selectedKeys={[]}>
              {headerNavs.map((nav, idx) => {
                const linkProps = {};
                if (nav.newWindow) {
                  linkProps.href = nav.to;
                  linkProps.target = '_blank';
                } else if (nav.external) {
                  linkProps.href = nav.to;
                } else {
                  linkProps.to = nav.to;
                }
                return (
                  <Menu.Item key={idx}>
                    <Link {...linkProps}>
                      {nav.icon ? (
                        <FoundationSymbol type={nav.icon} size="small" />
                      ) : null}
                      {!isMobile ? nav.text : null}
                    </Link>
                  </Menu.Item>
                );
              })}
            </Menu>
          ) : null}
          {/* Header 菜单项 end */}

          {/* Header 右侧内容块 */}

          <Balloon
            trigger={
              <div
                className="ice-design-header-userpannel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                }}
              >
                <IceImg
                  height={40}
                  width={40}
                  src="https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png"
                  className="user-avatar"
                />
                <div className="user-profile">
                  <span className="user-name" style={{ fontSize: '13px' }}>
                    {me.username}
                  </span>
                  <br />
                  <span
                    className="user-department"
                    style={{ fontSize: '12px' }}
                  >
                    {me.role === 0 ? '普通用户' : '管理员'}
                  </span>
                </div>
                <Icon
                  type="arrow-down-filling"
                  size="xxs"
                  className="icon-down"
                />
              </div>
            }
            closable={false}
            className="user-profile-menu"
          >
            <ul>
              <li className="user-profile-menu-item">
                {
                  me.role === 0 ?
                  <Link to="/">
                    <FoundationSymbol type="person" size="small" />我的主页
                  </Link>
                  :
                  <Link to="/project/list">
                    <FoundationSymbol type="person" size="small" />管理界面
                  </Link>
                }
              </li>
              <li className="user-profile-menu-item">
                <Link to="/">
                  <FoundationSymbol type="repair" size="small" />设置
                </Link>
              </li>
              <li className="user-profile-menu-item">
                <Link to="/login">
                  <FoundationSymbol type="compass" size="small" />退出
                </Link>
              </li>
            </ul>
          </Balloon>
        </div>
      </Layout.Header>
    );
  }
}
