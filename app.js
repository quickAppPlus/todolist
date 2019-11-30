// express_demo.js 文件
const fs = require("fs");
const path = require("path");

// 前台发送 ajax请求后台数据进行渲染
// 引入 express 并且创建一个 express 实例赋值给 app
const express = require("express");
const bodyParser = require("body-parser");

// new 一个 express 实例
const app = express();

//设置模板引擎为ejs
app.set("view engine", "ejs");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const todoList = [];

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// 配置静态文件目录
app.use("/api", express.static("public"));
app.use("/views", function(req, res) {
  const id = req.query.id <= 2 ? req.query.id : 2;
  res.render("details", { id: id });
});

// 注意
// 1. app.use 第一个必须是 static
// 2. bodyParser.json() 表示会自动解析 json 格式的数据
app.use(bodyParser.json());

const sendHtml = (response, path) => {
  let options = {
    encoding: "utf-8"
  };
  fs.readFile(path, options, (error, data) => {
    // 表示把响应发送到客户端
    response.send(data);
  });
};

const sendJSON = (response, data) => {
  let r = JSON.stringify(data);
  response.send(r);
};

// 用 get 定义一个给用户访问的网址
// request 是浏览器发送的请求
// response 是我们要发给浏览器的响应
// get 表示请求方法是 GET
// / 表示请求 path 是 /
// app.get('/', () => {}) 表示以 GET 方法访问 / 这个 path
// 会调用 () => {} 这个回调函数
app.get("/", (request, response) => {
  let path = "../public/index.html";
  sendHtml(response, path);
});

app.get("/todo/all", (requrest, response) => {
  sendJSON(response, todoList);
});

const todoAdd = form => {
  // 给新增的 todo 增加 id 属性
  // 在 todoList.push 之前
  // 如果 todoList 里面有 todo
  // todo.id 就是 todoList 里最后一个 todo 的 id + 1
  // 如果 todoList 没有 todo
  // todo.id 为 1
  if (todoList.length === 0) {
    form.id = 1;
  } else {
    let tailTodo = todoList[todoList.length - 1];
    form.id = tailTodo.id + 1;
  }
  todoList.push(form);
  return form;
};

app.get("/todo/add", (request, response) => {
  debugger;
  let form = request.body;
  console.log(form);
  let todo = todoAdd(form);
  sendJSON(response, todo);
});

const todoDelete = id => {
  id = Number(id);
  let index = -1;
  for (let i = 0; i < todoList.length; i++) {
    let t = todoList[i];
    if (t.id === id) {
      index = i;
      break;
    }
  }

  // 通过判断 index 的值来查看是否找到了这个 todo
  if (index > -1) {
    let t = todoList.splice(index, 1)[0];
    return t;
  } else {
    return {};
  }
};

// delete 这个路由函数用了一个叫做 动态路由 的概念
// 其中 :id 是一个动态变量
// 它可以匹配如下 url
// /todo/delete/1
// /todo/delete/2

// 甚至可以匹配下面的 url
// /todo/delete/error
app.get("/todo/delete/:id", (request, response) => {
  // 动态路由的变量通过 request.params.id 的方式获取
  // 变量类型永远是 string
  let id = request.params.id;
  let todo = todoDelete(id);
  sendJSON(response, todo);
});

const main = () => {
  // listen 函数的第一个参数是我们要监听的端口
  // 这个端口是要浏览器输入的
  // 默认的端口是 80
  // 所以如果你监听 80 端口的话，浏览器就不需要输入端口了
  // 但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
  let server = app.listen(9090, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log(`应用实例，访问地址为 http://${host}:${port}`);
  });
};

// 这个是套路写法
if (require.main === module) {
  main();
}
