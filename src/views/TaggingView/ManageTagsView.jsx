/* eslint-env browser */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import {connect} from 'react-redux';
import {Flex, Box} from 'reflexbox';
import {Table} from 'antd';
import {uniq, identity, upperFirst} from 'lodash';

import TagEditor from './TagEditor';
import cmp from '../../utils/cmp';

class ManageTagsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: null,
    };
  }

  buildResultColumn(key) {
    const {tags} = this.props;
    const values = uniq(tags.map((tag) => tag.result[key]).filter(identity)).sort();
    return {
      title: upperFirst(key),
      dataIndex: key,
      key,
      render: (text, record) => `${record.result.category}`,
      sorter: (a, b) => cmp(a.result[key], b.result[key]) || cmp(a.id, b.id),
      filters: values.map((c) => ({text: c, value: c})),
      onFilter: (value, record) => record.result[key] === value,
    };
  }

  renderTable() {
    const {tags} = this.props;
    const columns = [
      {
        title: 'Expression',
        dataIndex: 'expr',
        key: 'expr',
        sorter: (a, b) => cmp(a.expr, b.expr) || cmp(a.id, b.id),
      },
      this.buildResultColumn('category'),
    ];
    return (<div>
      <Table
        columns={columns}
        dataSource={tags}
        pagination={{defaultPageSize: 25}}
        size="small"
        rowKey="id"
        bordered
        onRowClick={(tag) => {
          this.setState({selectedId: tag.id});
        }}
      />
    </div>);
  }

  render() {
    const selectedTag = this.props.tags.find((t) => t.id === this.state.selectedId);
    const tagEditor = (selectedTag ? <TagEditor tag={selectedTag} /> : null);
    return (
      <Flex flexAuto>
        <Box style={{flex: 3}} pr={1}>{this.renderTable()}</Box>
        {tagEditor ? <Box style={{flex: 1}}>{tagEditor}</Box> : null}
      </Flex>
    );
  }
}

export default connect(
  (state) => ({
    transactions: state.transactions,
    tags: state.tags || [],
  })
)(ManageTagsView);
