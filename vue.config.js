const webpack = require('webpack');

const proxyTarget = 'https://localhost:5001';

module.exports = {
  devServer: {
    proxy:{
      'api/': {
        target: proxyTarget,
        secure: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack:{
    plugins:[
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/_partials/_variables.scss";`
      }
    }
  }
};

