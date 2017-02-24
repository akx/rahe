/* eslint-env browser */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import {connect} from 'react-redux';
import {cloneDeep, upperFirst} from 'lodash';
import {Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button} from 'antd';
import update from 'immutability-helper';

import QuickTagSelector from './QuickTagSelector';
import tagTransactions from '../../utils/tagTransactions';

const FormItem = Form.Item;

class TagEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: cloneDeep(props.tag),
      matchCount: null,
    };
  }

  componentDidMount() {
    this.updateTagMatchCount();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tag: cloneDeep(nextProps.tag),
      matchCount: null,
    });
  }

  setResult(key, value) {
    this.setState({
      tag: update(this.state.tag, {result: {[key]: {$set: value}}}),
    });
  }

  updateTagMatchCount() {
    const expr = this.state.tag.expr;
    if (!expr) return;
    tagTransactions(
      this.props.transactions,
      [{expr, result: {'match': true}}],
      true
    ).then((taggedTransactions) => {
      this.setState({matchCount: taggedTransactions.length});
    });
  }

  setExpr(expr) {
    this.setState({
      tag: update(this.state.tag, {expr: {$set: expr}}),
    }, () => {
      this.updateTagMatchCount();
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.dispatch({type: 'UPDATE_TAG', payload: this.state.tag});
  };

  handleDelete = () => {
    this.props.dispatch({type: 'DELETE_TAG', payload: this.state.tag});
  };

  render() {
    const {tag, matchCount} = this.state;
    const resultKeys = Object.keys(tag.result).sort();
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Expression">
          <Input
            value={tag.expr}
            onChange={(e) => this.setExpr(e.target.value)}
          />
          Matching transactions: {matchCount !== null ? matchCount : '-'}
        </FormItem>
        {resultKeys.map((key) => (
          <FormItem label={upperFirst(key)} key={key}>
            <Input
              value={tag.result[key]}
              onChange={(e) => this.setResult(key, e.target.value)}
            />
            <QuickTagSelector
              tags={this.props.tags}
              resultKey={key}
              onSelect={(value) => this.setResult(key, value)}
            />
          </FormItem>
        ))}
        <Button type="primary" htmlType="submit" size="large">Save</Button>
        &nbsp;
        <Button type="danger" onClick={this.handleDelete}>Delete</Button>
      </Form>
    );
  }
}

export default connect(
  (state) => ({
    transactions: state.transactions,
    tags: state.tags || [],
  })
)(TagEditor);
