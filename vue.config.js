const { TransformFilePathPlugin } = require("./plugins/globalDispatch");

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new TransformFilePathPlugin()]
  }
};
