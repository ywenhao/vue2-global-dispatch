const fs = require("fs");
const path = require("path");

class TransformFilePath {
  apply(compiler) {
    compiler.hooks.emit.tap("vue-loader", compilation => {
      console.log(compilation);
      writeEventKeys();
    });
  }
}

function writeEventKeys() {
  console.log(getFilePath());
}

function getFilePath(p = "src") {
  const paths = fs.readdirSync(path.join(__dirname, "../" + p), "utf-8");
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
  return paths.filter(v => !v.includes(".")).map(v => `${path}/${v}`);
}

function getVueFiles(paths, path) {
  return paths.filter(v => v.endsWith(".vue")).map(v => `${path}/${v}`);
}

module.exports = { TransformFilePath, writeEventKeys };
