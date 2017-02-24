import React from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import ImportView from './views/ImportView';
import WelcomeView from './views/WelcomeView';
import TaggingView from './views/TaggingView';

const {Content, Footer, Sider} = Layout;

const viewNames = {
  'welcome': 'Welcome',
  'import': 'Import',
  'tagging': 'Tagging',
};

const viewComponents = {
  'welcome': () => <WelcomeView />,
  'import': () => <ImportView />,
  'tagging': () => <TaggingView />,
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'welcome'};
  }

  render() {
    const {view} = this.state;
    const viewName = viewNames[view] || view;
    const viewComponent = (viewComponents[view] || (() => view))();
    return (
      <Layout>
        <Sider>
          <Menu theme="dark" mode="inline" selectedKeys={[view]} onSelect={({key}) => this.setState({view: key})}>
            <Menu.Item key="welcome">
              <span>
                <Icon type="money" />
                <span className="nav-text"><b>Rahe</b></span>
              </span>
            </Menu.Item>
            <Menu.Item key="import">
              <span>
                <Icon type="file" />
                <span className="nav-text">Import Data</span>
              </span>
            </Menu.Item>
            <Menu.Item key="tagging">
              <span>
                <Icon type="tag" />
                <span className="nav-text">Tagging</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{margin: '0 16px', flex: 'auto', display: 'flex', flexDirection: 'column'}}>
            <Breadcrumb style={{margin: '12px 0'}}>
              <Breadcrumb.Item>Rahe</Breadcrumb.Item>
              <Breadcrumb.Item>{viewName}</Breadcrumb.Item>
            </Breadcrumb>
            {viewComponent}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}
