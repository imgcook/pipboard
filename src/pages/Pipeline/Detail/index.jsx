import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Typography, Row, Col, Timeline, Select, Button, Divider, Card, message, Radio, List, Tag } from 'antd';

import { formatPlugins2Update, createPluginsFromPipeline } from '~/common/utils';
import { pipeline, plugin, job } from '~/common/service';
import { PLUGINS, pluginList } from '~/config';
import useQuery from '~/hooks/useQuery';

import './index.less';

const { Title } = Typography;
const { Option } = Select;

export default function Detail(props) {

  const { history } = props;

  const queryPipelineId = useQuery().get("pipelineId");

  const [radioChecked, setRadioChecked] = useState([])
  const [jobs, setJobs] = useState([]);
  const [plugins, setPlugins] = useState({});
  const [currentPlugin, setCurrentPlugin] = useState({});

  useEffect(() => {
    async function initPlugins () {
      if (queryPipelineId) {
        const pipelineRes = await pipeline.get(queryPipelineId);
        if (!pipelineRes) {
          message.error('timeout to request the pipeline and plugins.');
          return;
        }
        const plugins = createPluginsFromPipeline(pipelineRes);
        setPlugins(plugins);

        const radioChecked = PLUGINS.filter(({ id }) => {
          return pluginList[id] && plugins[id];
        }).map(({id}, i) => {
          return {
            item: plugins[id],
            checked: i === 0
          }
        });
        setRadioChecked(radioChecked);

        // fetch the plugin data in async.
        const metadata = await plugin.fetch(plugins['dataCollect']?.id);
        setCurrentPlugin(metadata);
        // fetch the jobs data in async. TODO
        const jobs = await job.list({ pipelineId: queryPipelineId });
        setJobs(jobs);
      }
    }
    initPlugins();
  }, []);

  const savePipeline = async (showMessage = true) => {
    const pluginsForUpdate = formatPlugins2Update(plugins);
    try {
      await pipeline.update(queryPipelineId, { plugins: pluginsForUpdate });
      if (showMessage) {
        message.success('Update Pipeline Successfully');
      }
    } catch (err) {
      message.error('Update Pipeline failed');
    }
  }

  const startJob = async () => {
    await savePipeline(false);

    const hide = message.loading('installing plugins', 0);
    const resp = await pipeline.install(queryPipelineId);
    await pipeline.traceEvent(resp.traceId, (event, data) => {
      console.info(event, data);
    });

    hide();
    const job = await job.run(queryPipelineId);
    history.push(`/job/info?jobId=${job.id}&traceId=${job.traceId}`);
  }

  const checkHandle = async (i) => {
    setRadioChecked(radioChecked.map((itm, index) => ({
      item: itm.item,
      checked: i === index
    })));
    const id = radioChecked[i].item?.id;
    const metadata = await plugin.fetch(id);
    setCurrentPlugin(metadata);
  }

  return <>
    <Title level={3} style={{ marginBottom: 38 }}>Configuration</Title>
    <Row gutter={24}>
      <Col span={6}>
        <Timeline>
          {
            PLUGINS.filter(({ id }) => {
              return pluginList[id] && plugins[id];
            }).map(({ id, title }, index) => {
              const pluginItm = plugins[id];
              return <Timeline.Item key={id} dot={<Radio style={{marginRight: 0}} checked={radioChecked[index]?.checked} onChange={() => checkHandle(index)} />}>
                <Title level={5} style={{ marginBottom: 12 }}>{title}</Title>
                <Select allowClear defaultValue={pluginItm.name} style={{ width: "100%" }}>
                  {pluginList[id].map((value) => <Option key={value} value={value}>{value}</Option>)}
                  <Option key={pluginItm.name} value={pluginItm.name}>{pluginItm.name}</Option>
                </Select>
              </Timeline.Item>;
            })
          }
        </Timeline>
        <Divider />
        <Row gutter={12}>
          <Col span={8}>
            <Button onClick={savePipeline}>Save</Button>
          </Col>
          <Col span={8}>
            <Button onClick={startJob}>Start</Button>
          </Col>
          <Col span={8}>
            <Button disabled>Delete</Button>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <div className="plugin-config">
          <Card
            size="small"
            title={currentPlugin.name}>
            <p>{currentPlugin.description || 'no description'}</p>
          </Card>
        </div>
      </Col>
      <Col span={10}>
        <Card
          title={`Jobs(${jobs.length})`}
          bordered={false}
          style={{ width: '100%' }}>
          <List
            itemLayout="horizontal"
            dataSource={jobs}
            renderItem={item => {
              let description = '';
              if (job.status === 0) {
                description = 'initializing the dataset';
              } else if (job.status === 1) {
                description = 'running this pipeline...';
              } else if (job.status === 2) {
                description = <div>
                  <Tag icon={<CheckCircleOutlined />} color="success">success</Tag>
                  <Button size="small">download output</Button>
                </div>;
              } else if (job.status === 3) {
                description = 'failed';
              }
              return(<List.Item>
                <List.Item.Meta
                  title={<Link to={{ pathname: "/job/info", search: `?jobId=${item.id}` }}><Button type="link">{item.createdAt}</Button></Link>}
                  description={description}
                />
              </List.Item>)
            }}
          />
        </Card>
      </Col>
    </Row>
  </>
}
