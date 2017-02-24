/* eslint-env browser */
import React from 'react';
import {Alert, Radio, Form, Button, Icon} from 'antd';
import first from 'lodash/first';
import {connect} from 'react-redux';

import {importerList, importerMap} from '../fmt';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const readFile = (file, format, encoding = 'UTF-8') => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onerror = () => reject(fr.error);
  fr.onload = () => resolve(fr.result);
  if (format === 'text') {
    return fr.readAsText(file, encoding);
  }
  reject(new Error(`unknown format ${format}`));
});


class ImportView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      importerId: first(importerList).id,
      busy: false,
      error: null,
      data: null,
    };
  }

  readFile(fileList) {
    const importer = importerMap[this.state.importerId];
    if (!importer) return;
    if (fileList.length === 0) return;
    this.setState({busy: true, error: null, data: null});
    readFile(fileList[0], importer.format, importer.encoding).then(
      importer.importer
    ).then((data) => {
      this.setState({busy: false, data});
    }).catch((error) => {
      this.setState({busy: false, data: null, error});
    });
  }

  saveData() {
    const {data} = this.state;
    if (!data) {
      alert('No data to save.');
      return;
    }
    this.props.dispatch({type: 'ADD_TRANSACTIONS', payload: data});

  }

  render() {
    const {busy, error, data} = this.state;
    let successMessage;
    if (data) {
      successMessage = (
        <Alert
          message="Import OK"
          type="success"
          showIcon
          description={`${data.length} transactions read`}
        />
      );
    }
    return (<div>
      <h1>Import Data</h1>
      <Form>
        <FormItem>
          <h2>Select importer</h2>
          <RadioGroup onChange={(importerId) => this.setState({importerId})} value={this.state.importerId}>
            {importerList.map((i) => <Radio key={i.id} value={i.id}>{i.name}</Radio>)}
          </RadioGroup>
        </FormItem>
        <FormItem>
          <h2>Select file</h2>
          <p>Select a supported file.</p>
          <p>
            <input type="file" onChange={(e) => this.readFile(e.target.files)} disabled={busy} />
          </p>
        </FormItem>
        <FormItem>
          {successMessage}
          {error ? <Alert message="Error" type="error" showIcon description={error} /> : null}
          <Button type="primary" disabled={busy || error || !data} onClick={() => this.saveData()}>
            <Icon type="play-circle" />
            Save
          </Button>
        </FormItem>
      </Form>
    </div>);
  }
}

export default connect()(ImportView);
