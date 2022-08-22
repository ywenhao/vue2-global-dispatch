const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const prettier = require("prettier");
const prettierConfig = require("../prettier.config");

/**
 * @typedef {import("webpack/lib/Compiler")} Compiler
 */

const PLUGIN_NAME = "global-dispatch";
const KEYS_PATH = path.resolve(__dirname, "../types/event-keys.d.ts");

class VueFilePathPlugin {
  /**
   * @param {Compiler} compiler
   * @returns {void}
   */
  apply(compiler) {
    compiler.hooks.done.tap(PLUGIN_NAME, () => {
      process.env.NODE_ENV === "development" && writeEventKeys();
    });
  }
}

function writeEventKeys() {
  const vueFilePaths = getFilePath();
  writeVueKeyPaths(vueFilePaths);
}

/**
 * 缓存内容，防止重复写入
 */
let keysContentCache = fs.readFileSync(KEYS_PATH, "utf-8");

/**
 * 写入__filePath到type Key文件
 * @param {string[]} paths 路径集合
 */
function writeVueKeyPaths(paths) {
  let keysContent = "export type EventKeys =";
  const keys = [];

  paths.forEach(p => {
    let content = fs.readFileSync(getSrcPath(p), "utf-8");
    const scriptMatch = content.match(/<script/g);
    if (!scriptMatch) return;

    const startIndex = content.indexOf("export default");
    if (startIndex < 0) return;

    const endIndex = content.indexOf("</script>", startIndex);
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
  });

  keysContent += keys.map(v => `'${v}'`).join("|") || "string";

  keysContent = prettier.format(keysContent, {
    ...prettierConfig,
    parser: "typescript"
  });

  if (keysContentCache !== keysContent) {
    keysContentCache = keysContent;
    fs.writeFileSync(KEYS_PATH, keysContent);
  }
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

module.exports = VueFilePathPlugin;
