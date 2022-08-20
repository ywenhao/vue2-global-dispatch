const fs = require("fs");
const path = require("path");
const acorn = require("acorn");

/**
 * @typedef {import("webpack/lib/Compiler")} Compiler
 */

const pluginName = "global-dispatch";

class TransformFilePathPlugin {
  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, () => {
      writeEventKeys();
    });
  }
}

function writeEventKeys() {
  const vueFilePaths = getFilePath();
  writeVueKeyPaths(vueFilePaths);
}

/**
 * 写入__filePath到type Key文件
 * @param {string[]} paths 路径集合
 */
function writeVueKeyPaths(paths) {
  const keys = [];
  paths.forEach(p => {
    let content = fs.readFileSync(getSrcPath(p), "utf-8");
    const scriptMatch = content.match(/<script/g);
    if (!scriptMatch) return;

    if (scriptMatch.length === 1) {
      const startIndex = content.indexOf("export default");
      const endIndex = content.indexOf("</script>");
      content = content.substring(startIndex, endIndex);

      const ast = acorn.parse(content, { sourceType: "module" });
      const defaultExportAst = ast.body.find(
        v => v.type === "ExportDefaultDeclaration"
      );

      let properties;
      if (defaultExportAst.declaration.type === "CallExpression") {
        properties = defaultExportAst.declaration.arguments[0].properties;
      }
      if (
        defaultExportAst.declaration.type === "ObjectExpression" &&
        Array.isArray(defaultExportAst.declaration.properties)
      ) {
        properties = defaultExportAst.declaration.properties;
      }

      const methods = properties.find(v => v.key.name === "methods");
      if (!methods) return;

      if (methods.value.properties.length) {
        const methodNames = methods.value.properties.map(
          v => `${p}:${v.key.name}`
        );
        keys.push(...methodNames);
      }
    }
  });
  console.log(keys);
}

/**
 *
 * @param {string=} p 路径
 * @returns {string[]} 路径集合
 */
function getFilePath(p = "src") {
  const paths = fs.readdirSync(getSrcPath(p), "utf-8");
  const vueFiles = getVueFiles(paths, p);
  const dirs = getDirs(paths, p);

  if (dirs.length) {
    dirs.forEach(dir => {
      vueFiles.push(...getFilePath(dir));
    });
  }
  return vueFiles;
}

function getDirs(paths, path) {
  return paths
    .map(v => `${path}/${v}`)
    .filter(v => fs.statSync(v).isDirectory());
}

function getVueFiles(paths, path) {
  return paths.filter(v => v.endsWith(".vue")).map(v => `${path}/${v}`);
}

function getSrcPath(p) {
  return path.resolve(__dirname, "../" + p);
}

module.exports = { TransformFilePathPlugin };
