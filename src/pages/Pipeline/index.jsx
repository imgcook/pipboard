import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Tag } from 'antd';
import dayjs from 'dayjs';

import { pipeline } from '../../common/service';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    render: (val) => <Link to={`/pipeline/info?pipelineId=${val}`}>{val}</Link>,
  },
  {
    title: 'Dataset',
    dataIndex: 'dataCollect',
  },
  {
    title: 'Model',
    dataIndex: 'modelDefine',
  },
  {
    title: 'Jobs',
    dataIndex: 'jobs',
    render: (val) => <Tag color={'geekblue'}>{val.length}</Tag>,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    render: (val) => <span>{dayjs(val).format('M/D/YYYY, h:m:s a')}</span>,
  },
];

export default function Pipeline() {

  const [data, setData] = useState([]);

  const list = (currentPage) => {
    return pipeline.list(currentPage);
  }

  useEffect(() => {
    list(1).then(res => {
      setData(res);
    });
  }, []);

  return <Table
    rowKey={'id'}
    columns={columns}
    dataSource={data}
  />;
};
