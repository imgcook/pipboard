import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Timeline, Select, Form, Button, Divider, Tabs } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { PLUGINS, pluginList } from 'src/config';
import { createPluginsFromPipeline, formatJSON } from 'src/common/utils';
import { job, pipeline } from 'src/common/service';
import useQuery from 'src/hooks/useQuery';

import './index.less';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export default function JobDetail(props) {

  const { history } = props;

  const [plugins, setPlugins] = useState({});
  const [jobLog, setJobLog] = useState({
    stdout: '',
    stderr: '',
    evaluate: {
      pass: null,
      maps: null,
    },
  });
  
  const query = useQuery();
  const queryJobId = query.get("jobId");
  const queryTraceId = query.get("traceId");

  const [pipelineId, setPipelineId] = useState("");

  const updateJobState = async (jobRes) => {
    const logs = await job.log(queryJobId);
    if (!logs) {
      return;
    }
    setJobLog({
      stdout: logs[0],
      stderr: logs[1],
      evaluate: {
        pass: jobRes.evaluatePass,
        maps: jobRes.evaluateMap ? formatJSON(jobRes.evaluateMap) : null,
      },
      dataset: jobRes.dataset ? formatJSON(jobRes.dataset) : null,
      status: jobRes.status,
    });
  }

  const listenJobState = async (id) => {
    try {
      await job.traceEvent(id, (event, msg) => {
        if (event === 'log') {
          setJobLog(prev => ({
            ...prev,
            stdout: msg.level === 'info' ? `${prev.stdout}${msg.data}\n` : prev.stdout,
            stderr: msg.level === 'error' ? `${prev.stderr}${msg.data}\n` : prev.stderr,
          }))
        }
      });
    } catch (err) {
      setJobLog(prev => ({
        ...prev,
        stderr: `${prev.stderr}${err.stack}\n`,
      }))
    }
  }
  
  useEffect(() => {
    const init = async () => {
      const jobRes = await job.get(queryJobId);
      const pipelineRes = await pipeline.get(jobRes.pipelineId);

      setPlugins(createPluginsFromPipeline(pipelineRes));
      setPipelineId(jobRes.pipelineId);

      // setJobRes(jobRes);
      // TODO 0 1 5 轮询 2 3 4 结束
      if (queryTraceId && jobRes.status < 2) {
        listenJobState(queryTraceId);
      } else {
        updateJobState(jobRes);
      }
    }
    init();
  }, [])

  const goPipeline = () => {
    history.push(`/pipeline/info?pipelineId=${pipelineId}`);
  }

  const renderLogView = (logs) => {
    return logs ? <pre className="job-logview">
      {logs.replace(/\r/g, '\n')}
      {jobLog?.status === 1 && <LoadingOutlined />}
    </pre> : null;
  }

  const renderJSONView = (json) => {
    return <pre className="job-logview">{json}</pre>;
  }

  const renderSummary = () => {
    try {
      const resp = JSON.parse(jobLog?.evaluate?.maps);
      const view = <div style={{ marginTop: 30 }}>
        <Form style={{width: '60%'}} labelCol={{ fixedSpan: 10 }}>
          <Form.Item label="accuracy">
            <p>{resp.accuracy.toPrecision(5)}</p>
          </Form.Item>
          <Form.Item label="loss">
            <p>{resp.loss.toPrecision(5)}</p>
          </Form.Item>
        </Form>
      </div>;
      return view;
    } catch (err) {
      return renderJSONView(jobLog?.evaluate?.maps);
    }
  }

  return <>
    <Title level={3} style={{ marginBottom: 38 }}>Job({queryJobId})</Title>
    <Row gutter={24}>
      <Col span={8}>
        <Timeline>
          {
            PLUGINS.filter(({ id }) => {
              return pluginList[id] && plugins[id];
            }).map(({ id, title }) => {
              const name = plugins[id]?.name;
              return (
                <Timeline.Item color="gray" key={id}>
                  <Title level={5} style={{ marginBottom: 12 }}>{title}</Title>
                  <Select value={name} style={{ width: "100%" }} disabled>
                    <Option key={name} value={name}>{name}</Option>
                  </Select>
                </Timeline.Item>
              );
            })
          }
        </Timeline>
        <Divider />
        <Row gutter={12}>
          <Col span={8}>
            <Button block onClick={goPipeline} style={{fontSize: '12px'}}>View Pipeline</Button>
          </Col>
          <Col span={8}>
            <Button block onClick={() => location.reload()}>Restart</Button>
          </Col>
          <Col span={8}>
            <Button block disabled>Stop</Button>
          </Col>
        </Row>
        <Divider />
        <Button
          block
          onClick={() => window.open(job.getOutputDownloadURL())}>
          Download Output
        </Button>
      </Col>
      <Col span={16}>
        <div className="job-outputs">
          <Tabs size="small">
            <TabPane tab="stdout" key="1">
              {renderLogView(jobLog?.stdout)}
            </TabPane>
            <TabPane tab="stderr" key="2">
              {renderLogView(jobLog?.stderr)}
            </TabPane>
            <TabPane tab="dataset" key="3">
              {renderJSONView(jobLog?.dataset)}
            </TabPane>
            <TabPane tab="summary" key="4">
              {renderSummary()}
            </TabPane>
          </Tabs>
        </div>
      </Col>
    </Row>
  </>
}
