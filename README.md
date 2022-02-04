<h1 align="center">鹰空科技Ant Design Vue项目模板</h1>
<div align="center">
该项目模板以Ant Design Vue Pro为基础，作为管理后台项目的开发框架
</div>

## Overview

## 环境和依赖

- node
- yarn
- webpack
- eslint
- @vue/cli
- [ant-design-vue@1.x](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation) - antv/g2 封装实现

> 请注意，我们强烈建议本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。

## 项目下载和运行

- 拉取项目代码

```bash
git clone https://github.com/vueComponent/ant-design-vue-pro.git
cd ant-design-vue-pro
```

- 安装依赖

```
yarn install
```

- 开发模式运行

```
yarn run serve
```

- 编译项目

```
yarn run build
```

- Lints and fixes files

```
yarn run lint
```

## 其他说明

- **关于 Issue 反馈 (重要!重要!重要!) 请在开 _Issue_ 前，先阅读该内容：[Issue / PR 编写建议](https://github.com/vueComponent/ant-design-vue-pro/issues/90)**

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请确保你所使用的 vue-cli 是新版，并且已经学习 cli 官方文档使用教程

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码, `vue.config.js` 下的 `lintOnSave` 值改为 `false`

- 组件按需加载 `/src/main.js` L14 相关代码 `import './core/lazy_use'` / `import './core/use'`

- [修改 Ant Design 配色 (@kokoroli)](https://github.com/kokoroli/antd-awesome/blob/master/docs/Ant_Design_%E6%A0%B7%E5%BC%8F%E8%A6%86%E7%9B%96.md)

- I18n: [多语言支持 (@musnow)](./src/locales/index.js)

- 生产环境默认不加载 `mock`，更多详情请看 `src/mock/index.js`

- **用于生产环境，请使用 `release` 版本代码，使用 master 代码出现的任何问题需要你自行解决**

## 浏览器兼容

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           |

## 项目目录结构

## 网络请求

## 登录信息

## 权限路由说明

项目提供了两套权限实现方案，其中默认方案为前端固定路由表和权限配置，由后端提供用户权限标识，来识别是否拥有该路由权限。另一套方案为后端提供权限和路由信息结构接口，动态生成权限和菜单。

#### 路由拦截（/src/permission.js）

变量说明

1. allowList：免登录页面路径可添加到该数组中
2. loginRoutePath：登录页面路径
3. defaultRoutePath：默认访问地址

路由拦截逻辑

#### 路由/菜单说明

##### 格式和说明

```ecmascript 6
const routerObject = {
  redirect: noredirect,
  name: 'router-name',
  hidden: true,
  meta: {
    title: 'title',
    icon: 'a-icon',
    target: '_blank|_self|_top|_parent',
    keepAlive: true,
    hiddenHeaderContent: true,
  }
}
```

`{ Route }` 对象

| 参数               | 说明                                                 | 类型    | 默认值 |
| ------------------ | ---------------------------------------------------- | ------- | ------ |
| hidden             | 控制路由是否显示在 sidebar                           | boolean | false  |
| redirect           | 重定向地址, 访问这个路由时,自定进行重定向            | string  | -      |
| name               | 路由名称, 必须设置,且不能重名                        | string  | -      |
| meta               | 路由元信息（路由附带扩展信息）                       | object  | {}     |
| hideChildrenInMenu | 强制菜单显示为 Item 而不是 SubItem(配合 meta.hidden) | boolean | -      |

`{ Meta }` 路由元信息对象

| 参数                | 说明                                                                                                                                                                     | 类型         | 默认值 |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------ |
| title               | 路由标题, 用于显示面包屑, 页面标题 \*推荐设置                                                                                                                            | string       | -      |
| icon                | 路由在 menu 上显示的图标                                                                                                                                                 | [string,svg] | -      |
| keepAlive           | 缓存该路由                                                                                                                                                               | boolean      | false  |
| target              | 菜单链接跳转目标（参考 html a 标记）                                                                                                                                     | string       | -      |
| hidden              | 配合`hideChildrenInMenu`使用，用于隐藏菜单时，提供递归到父菜单显示 选中菜单项*（可参考 个人页 配置方式）*                                                                | boolean      | false  |
| hiddenHeaderContent | \*特殊 隐藏 [PageHeader](https://github.com/vueComponent/ant-design-vue-pro/blob/master/src/components/PageHeader/PageHeader.vue#L6) 组件中的页面带的 面包屑和页面标题栏 | boolean      | false  |
| permission          | 与项目提供的权限拦截匹配的权限，如果不匹配，则会被禁止访问该路由页面                                                                                                     | array        | []     |

> 路由自定义 `Icon` 请引入自定义 `svg` Icon 文件，然后传递给路由的 `meta.icon` 参数即可

路由构建例子方案 1

##### 路由例子

```ecmascript 6
const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      {
        path: '/dashboard',
        component: RouteView,
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        meta: {title: '仪表盘', icon: 'dashboard', permission: ['dashboard']},
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: {title: '分析页', permission: ['dashboard']}
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: {title: '监控页', permission: ['dashboard']}
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: {title: '工作台', permission: ['dashboard']}
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            // 该页面隐藏面包屑和页面标题栏
            meta: { title: '成功', hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            // 该页面隐藏面包屑和页面标题栏
            meta: { title: '失败', hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },
      ...
    ]
  },
]
```

> 1. 请注意 `component: () => import('..')` 方式引入路由的页面组件为 懒加载模式。具体可以看 [Vue 官方文档](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)
> 2. 增加新的路由应该增加在 '/' (index) 路由的 `children` 内
> 3. 子路由的父级路由必须有 `router-view` 才能让子路由渲染出来，请仔细查阅 vue-router 文档
> 4. `permission` 可以进行自定义修改，只需要对这个模块进行自定义修改即可 [src/store/modules/permission.js#L10](https://github.com/vueComponent/ant-design-vue-pro/blob/master/src/store/modules/permission.js#L10)

附权限路由结构：

![权限结构](https://static-2.loacg.com/open/static/github/permissions.png)

第二种前端路由由后端动态生成的设计，可以前往官网文档 https://pro.antdv.com/docs/authority-management 参考

## 主题配置

1. 主题配置按钮，源代码可查阅/src/layouts/BasicLayout.vue 中的 setting-drawer 组件，由运行环境控制是否显示 setting 按钮，默认仅在开发模式显示，可通过 isDev 变量自由控制是否显示。
2. 主题颜色可通过 /src/config/defaultSettings.js 配置
3. Ant Design 样式覆盖

这里介绍使用 Vue-CLI3 的常用样式覆盖方案，原理上是使用 less 提供的 [modifyVars](http://lesscss.org/usage/#using-less-in-the-browser-modify-variables) 的方式进行覆盖变量。

首先找到项目根目录下的 `vue.config.js` 如果文件不存在，可手动创建 配置项内容如下，我们的主要改动在 `css` 配置节点下：

```javascript
module.exports = {
  // ... more configs

  /* less 变量覆盖，用于自定义 ant design 主题 */
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  }
  /* less 变量覆盖 结束 */
}
```

> 需要注意的是 `javascriptEnabled: true` 一定不能漏掉！否则启动编译时， less 模块会报错。

以下是一些最常用的通用变量，所有样式变量可以在 [这里](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) 找到。

```css
@primary-color: #1890ff; // 全局主色
@link-color: #1890ff; // 链接色
@success-color: #52c41a; // 成功色
@warning-color: #faad14; // 警告色
@error-color: #f5222d; // 错误色
@font-size-base: 14px; // 主字号
@heading-color: rgba(0, 0, 0, 0.85); // 标题色
@text-color: rgba(0, 0, 0, 0.65); // 主文本色
@text-color-secondary: rgba(0, 0, 0, 0.45); // 次文本色
@disabled-color: rgba(0, 0, 0, 0.25); // 失效色
@border-radius-base: 4px; // 组件/浮层圆角
@border-color-base: #d9d9d9; // 边框色
@box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15); // 浮层阴影
```

## 多语言配置

1. 多语言配置文件目录：/src/locales

2. 设置默认语言可在 /src/core/bootstrap.js 中

   store.dispatch('setLang', storage.get(APP_LANGUAGE, 'zh-CN'))

3. 顶部多语言按钮 可在 /src/components/GlobalHeader/RightContent.vue 中注释组件

   <select-lang :class="prefixCls" />

4.

## 底部版本配置

1. 修改底部 Copyright，可在/src/layouts/UserLayout.vue 中修改
2.

## Logo 替换

1. /src/assets/logo.png 为浏览器 tab 图标
2. 左侧菜单 logo 配置为 /src/assets/logo.svg，源代码引用可参考/src/layouts/BasicLayout.vue

## 首屏加载动画

**需求**

为了缓解用户第一次访问时，加载 JS 过大所导致用户等待白屏时间过长导致的用户体验不好，进行的一个优化动效。

**实现方案**

1. 将 动画加载 dom 元素放在 #app 内，Vue 生命周期开始时，会自动清掉 #app 下的所有元素。

2. 将 动画加载 dom 元素放在 body 下，Vue 生命周期开始时 App.vue (created, mounted) 调用 `@/src/utils/util` 下的 removeLoadingAnimate(#id, timeout) 则会移除加载动画

最后一步：

目前提供有两个样式，均在 `public/loading` 文件夹内。且 pro 已经默认使用了一套 loading 动画方案，可以直接参考 `public/index.html`

## 通用组件规范

##### 列表

1. 查询列表组件均使用 s-table 组件进行分页展示处理，
2. 如未做要求，查询条件将最常用两个条件显示出来，其他条件作为展开显示。
3. 重置按钮，需在重置所有查询条件的同时，刷新列表数据。
4. 如遇到接口返回无分页数据的列表，可在 loadData 中包装一层分页结构，如：

```javascript
	loadData: parameter => {
    console.log('loadData.parameter', parameter)
    return fetchDepartmentList(Object.assign(parameter, this.queryParam))
      .then(res => {
        const pageObj = {
          pageSize: res.length,
          pageNumber: 0,
          totalCount: res.length,
          totalPage: 0,
          content: res
        }
        return pageObj
      })
  },
```

5. s-table 主动调用刷新

```javascript
this.$refs.table.refresh(true)
```

##### 弹窗提示

1. 消息提示

   ```javascript
   this.$message.success('操作成功！')
   this.$message.error('操作失败！')
   this.$message.info('这是最后一个标签了, 无法被关闭')
   ```

2. 通知消息

   ```javascript
   this.$notification.error({
     message: '标题',
     description: '内容'
   })
   this.$notification.success({
     message: '标题',
     description: '内容'
   })
   ```

3. 删除提示

   在项目中如需用到删除操作，则必须给予用户提示，点击确认后，方可进行删除操作。

   ```javascript
   <a-popconfirm title="" @confirm="handleDelete(record)">
   	<a>删除</a>
   </a-popconfirm>
   ```

##### 上传图片（支持拖拽排序）

##### 上传图片并编辑

##### 表单

1. 表单少于 5 项字段，使用弹窗形式进行填写（富文本组件需视具体情况而定）

2. 表单多于 5 项字段，使用页面形式进行填写。

3. 表单页面返回刷新页面，使用 keep-alive 保持列表查询状态。

   TODO：待完善

## 文件命名规范

## 样例

##### 查询列表

弹窗表单

弹窗列表

长表单

详情页
