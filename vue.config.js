// const { TransformFilePathPlugin } = require("./plugins/globalDispatch");
const path = require("path");
const { TransformFilePathPlugin } = require("./plugins/global-dispatch");
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new TransformFilePathPlugin()],
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: [
            {
              loader: path.resolve(__dirname, "./plugins/vue-path-loader.js")
            }
          ]
        }
      ]
    }
  }
};
