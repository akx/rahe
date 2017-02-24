/* eslint-env browser */
import React from 'react';
import {connect} from 'react-redux';
import {Flex, Box} from 'reflexbox';
import {Input, Table, Button, AutoComplete} from 'antd';
import {truncate, debounce, uniq, identity} from 'lodash';

import tagTransactions from '../utils/tagTransactions';

const cmp = (a, b) => {
  if (a < b) return -1;
  if (a > b) return +1;
  return 0;
};


class TaggingView extends React.Component {
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
    const autocompleteCategories = uniq(this.props.tags.map((tag) => tag.result.category).filter(identity)).sort();
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
          <Box p={1}>
            {autocompleteCategories.map((cat) => (
              <Button
                size="small"
                key={cat}
                style={{margin: '3px'}}
                onClick={() => this.setState({tagCategory: cat})}
              >
                {cat}
              </Button>
            ))}
          </Box>

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
          <Table
            columns={columns}
            dataSource={txnsMissingTags}
            size="middle"
            pagination={{defaultPageSize: 20}}
            rowKey="id"
            bordered
            title={() => `${txnsMissingTags.length} untagged transactions`}
          />
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
)(TaggingView);
