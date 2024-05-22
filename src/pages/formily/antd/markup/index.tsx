import React, { Children, useMemo } from 'react';
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
const RuleItemWrapper = (props) => {
  return (
    <div className="item-wrapper">
      <div className="item-content">{props.children}</div>
    </div>
  );
};
const ArrayWrapper = observer((props: any) => {
  const { SchemaField, form, layer, parentName } = props || {};
  const field = useField();
  console.log(
    '🚀 ~ ArrayWrapper ~ field.value =======>',
    field.address.entire,
    field,
  );
  return field.value?.map((item) => 11111) || '222';
  if (!field.value || !Array.isArray(field.value)) return null;
  return field.value?.map((item: any, index: number) => {
    const { type = 'item' } = item;
    const renderItem = () => {
      return (
        <SchemaField.Void x-component="RuleItemWrapper">
          <SchemaField.String
            name="name"
            x-decorator={'FormItem'}
            x-component="Input"
          />
          <SchemaField.String
            name="title"
            x-decorator="FormItem"
            x-component="Select"
            x-component-props={{
              options: [
                {
                  label: '1111',
                  value: '1111',
                },
              ],
              style: {
                width: '100%',
              },
            }}
          />
          <SchemaField.Array
            name="children"
            x-component="ArrayWrapper"
            x-component-props={{
              form,
              SchemaField,
              layer: layer + 1,
            }}
          />
        </SchemaField.Void>
      );
    };
    const renderGroup = () => {
      <SchemaField.Void x-component="RuleWrapper">
        <SchemaField.Array
          name="children"
          x-component="ArrayWrapper"
          x-component-props={{
            SchemaField,
          }}
        />
      </SchemaField.Void>;
    };
    return (
      <SchemaField key={index}>
        {type === 'item' ? renderItem() : renderGroup()}
      </SchemaField>
    );
  });
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
      <SchemaField>
        <SchemaField.Object name="rules" x-component={'RuleWrapper'}>
          <SchemaField.Array
            name={'children'}
            x-component="ArrayWrapper"
            x-component-props={{
              SchemaField,
            }}
          ></SchemaField.Array>
        </SchemaField.Object>
      </SchemaField>
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
