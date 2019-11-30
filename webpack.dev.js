const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "inline-source-map",
  devServer: {
    before(app) {
      app.get("*", (req, res, next) => {
        if (req.path.includes("datas.json")) {
        }
        next();
      });
    },
    proxy: [
      {
        context: ["/views", "/api"],
        target: "http://localhost:9090",
        logLevel: "warn"
      }
    ]
  }
});
