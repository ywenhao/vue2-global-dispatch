const fs = require("fs");
const path = require("path");

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
  paths.forEach(p => {
    const content = fs.readFileSync(getSrcPath(p), "utf-8");
    console.log(content);
  });
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
