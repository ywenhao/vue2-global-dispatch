const CopyWebpackPlugin = require("copy-webpack-plugin");
const { transformFilePath } = require("./src/plugins/transformFilePath");
const path = require("path");

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "src"),
          to: path.resolve(__dirname, "src"),
          transform(content) {
            return transformFilePath(content.toString());
          }
        }
      ])
    ]
  }
};
