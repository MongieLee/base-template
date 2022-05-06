const path = require('path');

const resolvePath = (file) => {
  return path.join(__dirname, file);
};

const isProd = process.env.NODE_ENV === 'production';
module.exports = {
  lintOnSave: false,
  publicPath: process.env.PUBLIC_PATH,
  outputDir: 'admin',
  productionSourceMap: false,
  devServer: {
    port: 3456,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      },
      '/uploadFiles': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      },
      '/exportFile': {
        target: 'http://localhost:8066',
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // "primary-color": "#41b883"
        },
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolvePath('./src/theme/common.less')]
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolvePath('./src'))
      .set('utils', resolvePath('./src/utils'))
      .set('components', resolvePath('./src/components'))
      .set('pages', resolvePath('./src/pages'))
      .set('assets', resolvePath('./src/assets'))
      .set('configs', resolvePath('./src/configs'))
      .set('theme', resolvePath('./src/theme'))
      .set('services', resolvePath('./src/services'));
  }
};
