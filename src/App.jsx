import {connect} from 'react-redux';
import React from 'react';
import {Breadcrumb, Icon, Layout, Menu} from 'antd';

import ImportView from './views/ImportView';
import WelcomeView from './views/WelcomeView';
import TaggingView from './views/TaggingView';
import ChartsView from './views/ChartsView';

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
  {
    id: 'charts',
    title: 'Charts',
    menuTitle: 'Charts',
    component: () => <ChartsView />,
    icon: 'dot-chart',
  },
];
const viewMap = views.reduce((map, v) => {
  map[v.id] = v;  // eslint-disable-line no-param-reassign
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


class App extends React.Component {  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {viewId, dispatch} = this.props;
    const view = viewMap[viewId];
    const viewComponent = (view ? view.component : (() => viewId))();
    return (
      <Layout>
        <Sider>
          <ViewMenu
            selected={viewId}
            onSelect={(newViewId) => dispatch({type: 'NAVIGATE_MAIN', payload: newViewId})}
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
