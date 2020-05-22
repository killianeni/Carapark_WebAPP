module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/_partials/_variables.scss";`
      }
    }
  }
};

