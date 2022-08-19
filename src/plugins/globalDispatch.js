function transformFilePath(content) {
  content = content.replace(
    /export default.*?\{/,
    $0 => `${$0} __filePath: test,`
  );
  console.log(content);
  return content;
}

function writeEventKeys() {}

module.exports = { transformFilePath, writeEventKeys };
