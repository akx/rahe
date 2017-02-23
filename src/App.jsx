import React from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';

const {Content, Footer, Sider} = Layout;

export default class App extends React.Component {
  render() {
    return (
      <Layout>
        <Sider>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['6']}>
            <Menu.Item key="6">
              <span>
                <Icon type="file" />
                <span className="nav-text">File</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{margin: '0 16px'}}>
            <Breadcrumb style={{margin: '12px 0'}}>
              <Breadcrumb.Item>Rahe</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
              Bill is a cat.
            </div>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}
