import React, { Component } from 'react';
import { Table, Pagination } from '@alifd/next';

import { messageError } from '@/utils/message';
import { getPipcook, redirect } from '@/utils/common';
import { PIPELINE_MAP, PIPELINE_STATUS } from '@/utils/config';

import './index.scss';

const PAGE_SIZE = 30; // number of records in one page

export default class Pipeline extends Component {

  pipcook = getPipcook()

  state = {
    models: [],
    fields: PIPELINE_MAP, // pipeline or job,
    currentPage: 1,
    totalCount: 0,
    renderable: false,
  }

  changePage = async (value) => {
    await this.fetchData(value);
  }

  fetchData = async (currentPage) => {
    try {
      const response = await this.pipcook.pipeline.list({
        offset: (currentPage - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      const result = response.map((item) => {
        return {
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString(),
          endTime: new Date(item.endTime).toLocaleString(),
          status: PIPELINE_STATUS[item.status],
        };
      });
      this.setState({
        models: result,
        totalCount: response.length,
        currentPage,
        renderable: true,
      });
    } catch (err) {
      if (err.message === 'Network Error') {
        this.setState({ renderable: false });
        redirect('/connect');
      } else {
        this.setState({ renderable: true });
        messageError(err.message);
      }
    }
  }

  componentDidMount = async () => {
    await this.fetchData(1);
  }

  render() {
    const { models, fields, currentPage, totalCount, renderable } = this.state;
    if (!renderable) {
      return <div />;
    }
    return (
      <div className="pipeline">
        <Table dataSource={models}
          hasBorder={false}
          stickyHeader
          offsetTop={45}>
          {
            fields.map(field => <Table.Column 
              key={field.name}
              title={field.name}
              dataIndex={field.field}
              cell={field.cell}
              sortable={field.sortable || false}
              width={field.width}
              align="center"
            />)
          }
        </Table>
        <Pagination
          current={currentPage} 
          total={totalCount} 
          pageSize={PAGE_SIZE} 
          type="simple"
          className="pagination-wrapper" 
          onChange={this.changePage}
        />
      </div>
    );
  }
  
}
