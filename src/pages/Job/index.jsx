import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Modal, Tag, Button } from 'antd';
import dayjs from 'dayjs';
import { PipelineStatus } from '@pipcook/pipcook-core/dist/types/database';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

import { job } from '../../common/service';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    render: (val) => <Link to={`/job/info?jobId=${val}`}>{val}</Link>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (val) => {
      const colors = {
        INIT: 'default',
        RUNNING: 'processing',
        SUCCESS: 'success',
        FAIL: 'error',
      };
      const Icon = ({status}) => {
        switch (status) {
          case 'INIT':
            return <ClockCircleOutlined />
          case 'RUNNING':
            return <SyncOutlined spin />
          case 'SUCCESS':
            return <CheckCircleOutlined />
          case 'FAIL':
            return <CloseCircleOutlined />
          default:
            break;
        }
      };
      return <Tag icon={<Icon status={val} />} size="small" color={colors[val]}>{val}</Tag>;
    }
  },
  {
    title: 'Evaluation',
    key: 'evaluateMap',
    render: (_, record) => {
      let result = null;
      if (record.evaluateMap) {
        result = JSON.parse(record.evaluateMap);
        if (result?.pass) {
          result.pass = undefined;
        }
      } else {
        return <span>no result</span>;
      }
      if (record.evaluatePass || record.evaluateMap) {
        const content = JSON.stringify(result, null, 2);
        const onClick = () => {
          const config = {
            title: 'evaluation',
            content: <div>{content}</div>,
          };
          Modal.info(config);
        };
        return <Button size="small" onClick={onClick}>{content.slice(0, 40)}</Button>;
      } else {
        return <Tag size="small" color="red">{record.error}</Tag>;
      }
    }
  },
  {
    title: 'Pipeline',
    dataIndex: 'pipelineId',
    render: (val) => <Link to={`/pipeline/info?pipelineId=${val}`}>{val}</Link>,
  },
  {
    title: 'End Time',
    dataIndex: 'endTime',
    render: (val) => (
      val === '1/1/1970, 8:00:00 AM' ? <span>-</span> :
      <span>{dayjs(val).format('M/D/YYYY, h:m:s a')}</span>
    ),
  },
  {
    title: 'Model',
    dataIndex: 'id',
    render: (val, record) => (
      <Button
        size="small"
        disabled={record.status !== 'SUCCESS'}
        onClick={() => window.open(job.getOutputDownloadURL(val))}
      >
        Download
      </Button>
    ),
  },
];

export default function Job() {

  const [data, setData] = useState([]);

  const list = (currentPage) => {
    return job.list(currentPage).then(res => {
      return res.map((item) => ({
        ...item,
        status: PipelineStatus[item.status]
      }));
    });
  };

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
