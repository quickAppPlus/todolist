const cp = require("child_process");
const datas = require("../public/datas.json");
const option = {
  cwd: "/Users/11104760/Downloads/videos1",
  env: process.env,
  setsid: false
};
Download = data => {
  var workerProcess = cp.exec("youtube-dl " + data.href, option, () => {
    if (datas.length > 0) Download(datas.shift());
  });
  workerProcess.on("exit", function(code) {
    console.log("子进程已退出，退出码 " + code);
  });
};
for (let i = 0; i < 4; i++) {
  Download(datas.shift());
}
