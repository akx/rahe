/* eslint-env browser */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import {Tabs} from 'antd';

import NewTagsView from './NewTagsView';
import ManageTagsView from './ManageTagsView';

const TabPane = Tabs.TabPane;

class TaggingView extends React.Component {

  render() {
    return (
      <Tabs defaultActiveKey="tagNew" animated={false}>
        <TabPane tab="Create New Tags" key="tagNew"><NewTagsView /></TabPane>
        <TabPane tab="Manage Tags" key="2"><ManageTagsView /></TabPane>
      </Tabs>
    );
  }
}

export default TaggingView;
