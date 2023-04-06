// 命令管理
const commander = require("commander");
// // 命令行交互工具
const inquirer = require("inquirer");
const fs = require("fs");
// 命令行中显示加载中
const downloadGit = require("download-git-repo");
const ora = require("ora");
const path = require("path");
const Git = require("../tools/git");
const { version } = require("../../package.json");

function myMap(list, fn) {
  var arr = [];
  for (var i = 0; i < list.length; i++) {
    arr[i] = fn(list[i], i);
  }
  return arr;
}
function run() {
  commander
    .version(version)
    .action(() => {
      insetSome(process.argv[2] || "");
      // workInprogress(process.argv[2] || "");
    })
    .parse(process.argv);
}

function insetSome(name) {
  //加点笑话
  const insetHello = [
    {
      type: "list",
      name: "hello",
      message: "bighjs是不是最帅的，请选择你的答案",
      choices: myMap(
        ["是，有亿点", "还行，也就校草级别", "特别帅，你愿意给他生猴子"],
        (v, idx) => ({ value: idx, name: v })
      ),
    },
  ];
  inquirer.prompt(insetHello).then((hellRepo) => {
    if (hellRepo.hello != 2) {
      console.log("猴子都不愿意帮他生，滚吧，下载个屁");
      process.exit(-1);
    }
    workInprogress(name);
  });
}

async function workInprogress(name) {
  let repolist = await getProList();
  if (typeof repolist == "string") {
    repolist = JSON.parse(repolist);
  }
  if (repolist.length === 0) {
    console.log("\n可以开发的项目数为 0, 肯定是配置错啦~~\n");
    process.exit(-1);
  }
  // 获取选择的项目名称
  const currentProName = await selectPro(repolist);
  // 获取项目的tag: { tag, down_url}
  const tag = await getTags(currentProName);
  downProject(Object.assign(tag, { repo: currentProName, name }));
}

async function getProList() {
  let repoList = [];
  let getProList = ora("获取项目列表...");
  getProList.start();

  try {
    repoList = await Git.getProjectList();
    getProList.succeed("获取项目列表成功");
  } catch (error) {
    console.log("download error:", error);
    getProList.fail("获取项目列表失败...");
    process.exit(-1);
  }
  return repoList;
}

async function selectPro(list) {
  const choices = myMap(list, (v) => v.name);
  const questions = [
    {
      type: "list",
      name: "repo",
      message: "请选择你想要开发的项目类型",
      choices,
    },
  ];
  const result = await inquirer.prompt(questions);
  return result.repo;
}

async function getTags(repoName) {
  let taginfo = {};
  let tagload = ora("获取项目版本...");
  tagload.start();

  // 获取项目的版本, 这里默认选择确定项目的最近一个版本
  try {
    let tagList = await Git.getProjectVersions(repoName);
    if (typeof tagList == "string") {
      tagList = JSON.parse(tagList);
    }
    if (!tagList.length) {
      throw error("是不是忘了给项目打个tag...");
    }
    const { name, zipball_url } = tagList[0];
    tagload.succeed("获取项目版本成功");
    tagload.info(`您选择的项目是${repoName}, 即将下载版本${name}`);
    taginfo = { tag: name, down_url: zipball_url };
  } catch (error) {
    console.log(error);
    tagload.fail("获取项目版本失败...");
    process.exit(-1);
  }
  return taginfo;
}

async function downProject(data) {
  let downLoad = ora("正在加速为您下载代码...");
  downLoad.start();

  var fileName = data.name || data.repo;
  var dirPath = path.join(process.cwd(), fileName);
  downLoad.info(`下载地址： ${data.down_url}`);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    downLoad.info(`文件加地址： ${dirPath}`);
    downLoad.succeed("项目文件夹创建成功");
  }

  downloadGit(
    "direct:https://codeload.github.com/billmian/react-webpack-template/zip/main",
    dirPath,
    function (err) {
      if (err) {
        downLoad.fail("项目下载失败");
      } else {
        downLoad.succeed("项目下载成功");
      }
    }
  );
}

run();
