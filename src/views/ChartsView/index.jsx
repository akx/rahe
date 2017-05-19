/* eslint-env browser */
/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react';
import {connect} from 'react-redux';
import {Checkbox, DatePicker} from 'antd';
import {Box, Flex} from 'reflexbox';
import moment from 'moment';
import {Bar} from 'react-chartjs-2';
import {fromPairs, groupBy, identity, sortBy, unzip} from 'lodash';

import tagTransactions from '../../utils/tagTransactions';
import dateFilterTransactions from '../../utils/dateFilterTransactions';

const {RangePicker} = DatePicker;
const CheckboxGroup = Checkbox.Group;

const filterOptions = [
  {label: 'Gains', value: 'showGains'},
  {label: 'Spends', value: 'showSpends'},
];

class ChartsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: moment().dayOfYear(1),
      end: moment(),
      showSpends: true,
      showGains: false,
      taggedTransactions: null,
      chartComponent: null,
      chartProps: null,
    };
  }

  componentDidMount() {
    this.updateChart(this.props, this.state);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChart(nextProps);
  }

  updateChart({transactions, tags}, state = this.state) {
    const {showSpends, showGains, start, end} = state;
    const filteredTransactions = dateFilterTransactions(transactions, start, end)
      .filter((txn) => (!showGains ? txn.amount < 0 : true))
      .filter((txn) => (!showSpends ? txn.amount > 0 : true))
    ;
    tagTransactions(filteredTransactions, tags).then((taggedTransactions) => {
      const txnsByCategory = groupBy(taggedTransactions, (txn) => {
        return ((txn.tags ? txn.tags.category : null) || '(other)').split(':')[0];
      });
      const categoryTotals = Object.keys(txnsByCategory).map(
        (category) => [
          category,
          txnsByCategory[category].reduce((acc, txn) => acc + txn.amount, 0)
        ]
      );
      const [categories, totals] = unzip(sortBy(categoryTotals, ([category, amount]) => amount));
      const chartComponent = Bar;
      const chartData = {
        labels: categories,
        datasets: [
          {
            label: 'Total By Category',
            data: totals,
          },
        ],
      };
      const chartProps = {data: chartData, width: 900, height: 500};
      this.setState({taggedTransactions, chartComponent, chartProps});
    });
  }

  setFilters = (newFilters) => {
    const newFilterStates = fromPairs(filterOptions.map((op) => [op.value, newFilters.indexOf(op.value) > -1]));
    this.setState(newFilterStates, () => {
      this.updateChart(this.props);
    });
  };

  setDates = ([newStart, newEnd]) => {
    this.setState({start: newStart, end: newEnd}, () => {
      this.updateChart(this.props);
    });
  };


  render() {
    const {start, end, taggedTransactions, chartComponent, chartProps} = this.state;
    const setFilters = filterOptions.map((op) => this.state[op.value] ? op.value : null).filter(identity);
    return (
      <div>
        <Flex>
          <Box><RangePicker value={[start, end]} onChange={this.setDates} /></Box>
          <Box><CheckboxGroup options={filterOptions} value={setFilters} onChange={this.setFilters} /></Box>
        </Flex>
        <div>{taggedTransactions ? taggedTransactions.length : 'loading'}</div>
        <div>{chartComponent ? React.createElement(chartComponent, chartProps) : null}</div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    transactions: state.transactions,
    tags: state.tags || [],
  })
)(ChartsView);
