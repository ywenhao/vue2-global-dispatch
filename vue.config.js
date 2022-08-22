const path = require("path");
const VueFilePathPlugin = require("./plugins/vue-file-path-plugin");
/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [new VueFilePathPlugin()],
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
