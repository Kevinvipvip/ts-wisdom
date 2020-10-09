const path = require('path');

module.exports = {
  outputDir:'wap',
  assetsDir: 'static',
  publicPath: '/wap/',
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)));

    config.module
      .rule('scss')
      .oneOf('vue')
      .use('px2rem-loader')
      .loader('px2rem-loader')
      .before('postcss-loader')
      .options({ remUnit: 75, remPrecision: 8 })
      .end();

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192
      })
  }
};

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/common.scss')
      ]
    })
}
