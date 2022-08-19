const { TransformFilePath } = require("./plugins/globalDispatch");

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new TransformFilePath()]
  }
};
