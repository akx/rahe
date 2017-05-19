/* eslint-env browser */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import {connect} from 'react-redux';
import {Box, Flex} from 'reflexbox';
import {Button, Input, Table, Tabs} from 'antd';
import {countBy, debounce, sortBy, toPairs, truncate} from 'lodash';

import QuickTagSelector from './QuickTagSelector';
import tagTransactions from '../../utils/tagTransactions';
import cmp from '../../utils/cmp';

class TopRecipientsTable extends React.PureComponent {
  render() {
    const {transactions, onClickRecipient} = this.props;
    const topRecipients = sortBy(toPairs(countBy(transactions, (txn) => txn.recipient)), (pair) => -pair[1]);
    return (
      <table>
        <tbody>
          {topRecipients.slice(0, 20).map(([recipient, count]) => <tr key={recipient}>
            <td>
              <a
                href="#"
                onClick={() => onClickRecipient(recipient)}
              >
                {recipient} &rarr;
              </a>
            </td>
            <td>{count}</td>
          </tr>)}
        </tbody>
      </table>
    );
  }
}

class NewTagsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taggedTransactions: null,
      tagExpr: '',
      tagCategory: '',
      tagMatchCounts: {},
    };
    this.updateTagMatchCountSoon = debounce(this.updateTagMatchCount.bind(this), 150);
  }

  componentDidMount() {
    this.updateTagged(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateTagged(nextProps);
  }

  updateTagged({transactions, tags}) {
    tagTransactions(transactions, tags).then((taggedTransactions) => {
      this.setState({taggedTransactions});
    });
  }

  updateTagMatchCount() {
    const {tagExpr} = this.state;
    if (!tagExpr) return;
    tagTransactions(
      this.props.transactions,
      [{expr: tagExpr, result: {'match': true}}],
      true
    ).then((taggedTransactions) => {
      const {tagMatchCounts} = this.state;
      tagMatchCounts[tagExpr] = taggedTransactions.length;
      this.setState({tagMatchCounts});
    });
  }

  setTagExprFromCopy(field, text) {
    this.setState(
      {tagExpr: `${field}=${text}`},
      (() => this.updateTagMatchCount())
    );
    this.tagCategoryInput.refs.input.focus();  // TODO: yigh, this is ugly
  }

  getTableColumns() {
    const copyButtonRenderer = (field) => (text) => (
      <span title={text}>
        {truncate(text || '\u2013', {length: 60})}
        &nbsp;
        {text ? <a href="#" onClick={() => this.setTagExprFromCopy(field, text)}>&rarr;</a> : null}
      </span>
    );
    return [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (text) => (<a href="#" onClick={() => this.setTagExprFromCopy('id', text)}>&rarr;</a>),
      },
      {
        title: 'Date',
        dataIndex: 'paymentDate',
        key: 'paymentDate',
        sorter: (a, b) => cmp(a.paymentDate, b.paymentDate) || cmp(a.id, b.id),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        className: 'column-money',
        key: 'amount',
        sorter: (a, b) => cmp(a.amount, b.amount) || cmp(a.id, b.id),
        render: (text, record) => record.amount.toFixed(2),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: copyButtonRenderer('type'),
      },
      {
        title: 'Recipient',
        dataIndex: 'recipient',
        key: 'recipient',
        sorter: (a, b) => cmp(a.recipient, b.recipient) || cmp(a.id, b.id),
        render: copyButtonRenderer('recipient'),
      },
      {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
        sorter: (a, b) => cmp(a.message, b.message) || cmp(a.id, b.id),
        render: copyButtonRenderer('message'),
      },
    ];
  }

  addCurrentTag() {
    const {tagExpr, tagCategory} = this.state;
    if (tagExpr && tagCategory) {
      this.props.dispatch({
        type: 'ADD_TAG',
        payload: {
          expr: tagExpr,
          result: {category: tagCategory},
        },
      });
      this.setState({tagExpr: '', tagCategory: ''});
      this.tagExprInput.refs.input.focus();  // TODO: yigh, this is ugly
    }
  }

  render() {
    const {taggedTransactions} = this.state;
    if (taggedTransactions === null) return <div>Please wait...</div>;
    const txnsMissingTags = taggedTransactions.filter((txn) => !txn.tags);
    const columns = this.getTableColumns();
    const nMatchingTxns = this.state.tagMatchCounts[this.state.tagExpr];
    return (
      <Flex flexAuto>
        <Box style={{flex: 1}} pr={1}>
          <h2>Add New Tag</h2>
          <Input
            addonBefore="Expression"
            addonAfter={nMatchingTxns !== undefined ? <span><b>{nMatchingTxns}</b> matches</span> : null}
            ref={(comp) => {
              this.tagExprInput = comp;
            }}
            value={this.state.tagExpr}
            onInput={(e) => {
              this.setState(
                {tagExpr: e.target.value},
                () => this.updateTagMatchCountSoon()
              );
            }}
          />
          <Input
            addonBefore="Category"
            ref={(comp) => {
              this.tagCategoryInput = comp;
            }}
            value={this.state.tagCategory}
            onInput={(e) => this.setState({tagCategory: e.target.value})}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                this.addCurrentTag();
              }
            }}
          />
          <QuickTagSelector
            tags={this.props.tags}
            resultKey="category"
            onSelect={(tag) => this.setState({tagCategory: tag})}
          />

          <Button
            size="large"
            type="primary"
            disabled={!(this.state.tagExpr && this.state.tagCategory)}
            onClick={() => this.addCurrentTag()}
          >
            Add
          </Button>
        </Box>
        <Box style={{flex: 2}} flex flexColumn>
          <Tabs>
            <Tabs.TabPane tab="Untagged Transactions" key="untagged">
              <Table
                columns={columns}
                dataSource={txnsMissingTags}
                size="middle"
                pagination={{defaultPageSize: 20}}
                rowKey="id"
                bordered
                title={() => `${txnsMissingTags.length} untagged transactions`}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Top Recipients" key="topRecipients">
              <TopRecipientsTable
                transactions={txnsMissingTags}
                onClickRecipient={(recipient) => this.setTagExprFromCopy('recipient', recipient)}
              />
            </Tabs.TabPane>
          </Tabs>
        </Box>
      </Flex>
    );
  }
}

export default connect(
  (state) => ({
    transactions: state.transactions,
    tags: state.tags || [],
  })
)(NewTagsView);
