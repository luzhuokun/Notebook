const execSync = require("child_process").execSync;
const path = require("path");
const fs = require("fs");
const os = require("os");

console.log("----自动升级版本号----");

try {
  const packageJsonPath = path.join("./package.json");
  const packageJsonStr = fs.readFileSync(packageJsonPath).toString();
  const packageJson = JSON.parse(packageJsonStr);
  const versionTemp = packageJson.version.split(".").map((s) => Number(s));
  versionTemp[2] += 1;
  const newVersion = versionTemp.join(".");
  packageJson.version = newVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, os.EOL));
  execSync("git add package.json");
} catch (error) {
  console.error("处理package.json失败，请重试", error);
  process.exit(1);
}
