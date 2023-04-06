// 判断如果 command 目录下是否存在用户输入的命令对应的文件
if (process.argv[2]) {
  require("./command/start.js");
} else {
  console.log(`你输入了未知指令...`);
  console.log(`你是想建项目吗？请试试：pro-cli <项目名称>`);
  process.exit(-1);
}
// console.log(process.cwd());
