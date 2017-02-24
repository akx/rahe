/* eslint-env browser */
import React from 'react';
import {connect} from 'react-redux';

const WelcomeView = ({transactions}) => (
  <div>
    <h1>Welcome to Rahe</h1>
    <p>{transactions ? `${transactions.length} transactions in database.` : null}</p>
  </div>
);

export default connect(
  (state) => ({
    transactions: state.transactions || [],
  })
)(WelcomeView);
