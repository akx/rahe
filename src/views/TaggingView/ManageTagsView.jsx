/* eslint-env browser */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import {connect} from 'react-redux';
import {Table} from 'antd';
import cmp from '../../utils/cmp';

class ManageTagsView extends React.Component {

  render() {
    const columns = [
      {
        title: 'Expression',
        dataIndex: 'expr',
        key: 'expr',
        sorter: (a, b) => cmp(a.expr, b.expr) || cmp(a.id, b.id),
      },
      {
        title: 'Category',
        dataIndex: 'result',
        key: 'result',
        render: (text, record) => `${record.result.category}`,
        sorter: (a, b) => cmp(a.result.category, b.result.category) || cmp(a.id, b.id),
      },
    ];
    return (<div>
      <Table
        columns={columns}
        dataSource={this.props.tags}
        pagination={{defaultPageSize: 25}}
        size="small"
        rowKey="id"
        bordered
      />
    </div>);
  }
}

export default connect(
  (state) => ({
    transactions: state.transactions,
    tags: state.tags || [],
  })
)(ManageTagsView);
