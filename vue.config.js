// ./src/assets/sass/style.scss

/*const path = require('path');

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      'preProcessor': 'stylus',
      'patterns': [
        path.resolve(__dirname, './src/assets/sass/style.scss'),
      ]
    }
  }
};*/

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/_partials/_variables.scss";`
      }
    }
  }
};

