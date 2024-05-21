import { defineConfig } from 'umi';
import path from 'path';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    {
      path: '/formily-antd-markup',
      component: '@/pages/formily/antd/markup/index',
    },
    {
      path: '/formily-antd-json',
      component: '@/pages/formily/antd/json/index',
    },
    {
      path: '/formily-form-demo',
      component: '@/pages/formily/form-demo/index',
    },
  ],
  fastRefresh: {},
  chainWebpack(config) {
    config.module
      .rule('test-loader')
      .test(/\.tsx$/)
      .use('test-loader')
      .options({
        theme: {
          'primary-color': '#284cc0',
        },
      })
      .loader(path.resolve(__dirname, './loader/test-loader'));
  },
});
