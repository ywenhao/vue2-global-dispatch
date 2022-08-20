module.exports = function(content) {
  if (process.env.NODE_ENV === "development") return content;

  const filePath = this.resourcePath
    .replace(/\\/g, "/")
    .replace(/(.*)?src/, "src");

  const reg = /export default.*?{/;
  content = content.replace(reg, $0 => `${$0} __filePath: "${filePath}",`);
  return content;
};
