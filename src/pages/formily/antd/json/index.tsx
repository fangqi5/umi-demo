import React, { Children, lazy, useMemo } from 'react';
import { Button, Select, Input, Form, Row, Col, Switch } from 'antd';
import {
  AreaChartOutlined,
  BarChartOutlined,
  DotChartOutlined,
} from '@ant-design/icons';
import { createForm } from '@formily/core';
import {
  FormProvider,
  createSchemaField,
  RecursionField,
  ArrayField,
  useField,
  useFieldSchema,
  observer,
} from '@formily/react';
import { ArrayItems } from '@formily/antd';
import 'antd/dist/antd.css';
import './index.less';
const FormItem = Form.Item;

const form = createForm({
  initialValues: {
    rules: {
      children: [],
    },
  },
});
// 自定义渲染数组项的组件
const RuleWrapper = (props: any) => {
  const field = useField();
  return (
    <div className="wrapper">
      <div className="content">
        <div className="content-left">And</div>
        <div className="content-right">
          {props.children}
          <div className="footer">
            <Button
              onClick={() => {
                form.setFieldState(field.address.entire, (state) => {
                  state.value.children.push({
                    type: 'item',
                  });
                });
              }}
            >
              添加一行
            </Button>
            <Button
              className="ml-12"
              onClick={() => {
                form.setFieldState(field.address.entire, (state) => {
                  state.value.children.push({
                    type: 'group',
                  });
                });
              }}
            >
              添加一组
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RULE_ITEM_SCHEMA: any = {
  type: 'object',
  'x-component': 'RuleItemWrapper',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
    },
    name: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {},
    },
    children: {
      // 这里可以继续嵌套
      type: 'array',
      'x-component': 'ArrayWrapper',
    },
  },
};
const RULE_GROUP_SCHEMA = {
  type: 'object',
  properties: {
    rules: {
      type: 'object',
      'x-component': 'RuleWrapper',
      properties: {
        children: {
          type: 'array',
          'x-component': 'ArrayWrapper',
        },
      },
    },
  },
};

const RuleItemWrapper = (props) => {
  return (
    <div className="item-wrapper">
      <div className="item-content">{props.children}</div>
    </div>
  );
};

const ArrayWrapper = observer((props: any) => {
  const field = useField();
  return (
    <div className="rule-item-wrapper">
      {field.value?.map((item, index) => {
        const { type = '' } = item;
        return (
          <RecursionField
            name={index.toString()}
            schema={type === 'group' ? RULE_GROUP_SCHEMA : RULE_ITEM_SCHEMA}
            key={index}
          />
        );
      })}
    </div>
  );
});
// 创建SchemaField并注册你的自定义组件

const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayField,
    ArrayItems,
    Select,
    RuleWrapper,
    Row,
    Col,
    ArrayWrapper,
    Switch,
    RuleItemWrapper,
  },
});

const App = () => {
  return (
    <FormProvider form={form}>
      <SchemaField schema={RULE_GROUP_SCHEMA} />
      <Row gutter={12}>
        <Col span={6}>
          <Button
            onClick={() =>
              form.submit((values) => {
                console.log('values======>', values);
              })
            }
            style={{ width: '100%' }}
          >
            提交
          </Button>
        </Col>
      </Row>
    </FormProvider>
  );
};

export default App;
