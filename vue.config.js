/* eslint-disable eol-last */
const path = require('path')
const webpack = require('webpack')
const isCenter = true.toString() === process.env.VUE_APP_PLATFORM_CENTER

function resolve (dir) {
  return path.join(__dirname, dir)
}

const port = process.env.port || process.env.npm_config_port || 8806 // dev port
// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': isCenter ? '#1CC2FD' : '#00CCA8',
          'link-color': '#1CC2FD',
          'success-color': '#43D882',
          'warning-color': '#FDB62B',
          'error-color': '#F02F2F',
          'font-size-base': '14px',
          'heading-color': '#0F121B',
          'text-color': '#0F121B',
          'text-color-secondary': '#8193B1',
          'disabled-color': '#ABB8CE',
          'border-radius-base': '2px',
          'border-color-base': '#E5EBF3',
          'box-shadow-base': '0 3px 7px rgba(25, 55, 92, 0.06)'
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js')
    proxy: {
      '/api': {
        // target: 'http://192.168.1.228:8091/esource', // 医院端
        target: 'http://192.168.1.227:8081/esource', // 中心端
        // target: 'http://192.168.1.72:8080/esource/center', // 本地代工测试
        // target: 'http://192.168.1.86:8080/esource/center', // 本地世军测试
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API_BASE_URL]: ''
        }
      }
    }
  },

  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}