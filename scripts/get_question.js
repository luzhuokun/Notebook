const fs = require("fs");
const path = require("path");

const IGNORE_FILES = ["docs_old"];

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item) => {
    if (IGNORE_FILES.includes(item)) {
      return;
    }
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(fullPath, filesList);
    } else {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

const filesList = readFileList(path.resolve(__dirname, "../docs"), []).filter(
  (item) => item.endsWith(".md")
);

const questions = [];

for (const filePath of filesList) {
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  data
    .trim()
    .split("\n")
    .filter((item) => item.startsWith("## "))
    .forEach((item) => questions.push(item));
}

const ranNum = 10;
console.log("总题数:", questions.length, "随机:", ranNum);
for (let i = 0; i < ranNum; i++) {
  var index = Math.floor(Math.random() * questions.length);
  console.log(questions.splice(index, 1)[0]);
}
