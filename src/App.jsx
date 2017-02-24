import React from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import ImportView from './views/ImportView';
import WelcomeView from './views/WelcomeView';
import TaggingView from './views/TaggingView';
import {connect} from 'react-redux';

const {Content, Footer, Sider} = Layout;

const views = [
  {
    id: 'welcome',
    title: 'Welcome',
    component: () => <WelcomeView />,
    icon: 'money',
  },
  {
    id: 'import',
    title: 'Import',
    menuTitle: 'Import Data',
    component: () => <ImportView />,
    icon: 'file',
  },
  {
    id: 'tagging',
    title: 'Tagging',
    menuTitle: 'Tagging',
    component: () => <TaggingView />,
    icon: 'tag',
  },
];
const viewMap = views.reduce((map, v) => {
  map[v.id] = v;
  return map;
}, {});

const ViewMenu = ({selected, onSelect}) => (
  <Menu
    theme="dark"
    mode="inline"
    selectedKeys={[selected]}
    onSelect={({key}) => onSelect(key)}
  >
    {
      views.map((v) => (
        <Menu.Item key={v.id}>
          <Icon type={v.icon} />
          <span className="nav-text">{v.menuTitle || v.title}</span>
        </Menu.Item>
      ))
    }
  </Menu>
);


class App extends React.Component {
  render() {
    const {viewId, dispatch} = this.props;
    const view = viewMap[viewId];
    const viewComponent = (view ? view.component : (() => viewId))();
    return (
      <Layout>
        <Sider>
          <ViewMenu
            selected={viewId}
            onSelect={(viewId) => dispatch({type: 'NAVIGATE_MAIN', payload: viewId})}
          />
        </Sider>
        <Layout>
          <Content style={{margin: '0 16px', flex: 'auto', display: 'flex', flexDirection: 'column'}}>
            <Breadcrumb style={{margin: '12px 0'}}>
              <Breadcrumb.Item>Rahe</Breadcrumb.Item>
              <Breadcrumb.Item>{view.title}</Breadcrumb.Item>
            </Breadcrumb>
            {viewComponent}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  (state) => ({viewId: state.app.view})
)(App);
