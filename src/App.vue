<template>
  <div>
    <el-container>
      <el-image :src="'api/header.jpg'"></el-image>
      <el-aside :span="2">Aside</el-aside>
      <el-container :span="20">
        <el-main>
          <el-row :gutter="20" v-for="data in datas" :key="data.index">
            <a v-if="data.index%2 == 0" v-bind:href="'views?id=' + data.index">
              <el-col :span="12">
                <el-card :body-style="{ padding: '0px' }">
                  <img class="image" v-bind:src="'api/images/' + data.index + '.webp'" />
                  <div class="details">
                    <span class="span">{{data.title}}</span>
                    <div class="bottom clearfix">
                      <time class="time">这里是详细介绍 {{ data.href }}</time>
                      <el-button icon="el-icon-s-promotion" type="text" class="button"></el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card :body-style="{ padding: '0px' }">
                  <img
                    class="image"
                    v-bind:src="'api/images/' + datas[data.index + 1].index + '.webp'"
                  />
                  <div class="details">
                    <span class="span">{{datas[data.index + 1].title}}</span>
                    <div class="bottom clearfix">
                      <time class="time">这里是详细介绍 {{ datas[data.index + 1].href }}</time>
                      <el-button icon="el-icon-s-promotion" type="text" class="button"></el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </a>
          </el-row>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
      <el-aside :span="2">Aside</el-aside>
    </el-container>
  </div>
</template>

<script>
// 1. 使用fetch 请求接口
// 2. 视频播放代理到本地
// 3. 使用样式库调整样式

// const datas = require("../public/datas.json");
// $.ajax({
//   url: "/api/datas.json",
//   type: "GET",
//   dataType: "json",
//   success: function(data) {
//     datas = data;
//   }
// });

export default {
  data() {
    return {
      datas: null,
      show2: true,
      currentDate: new Date()
    };
  },
  created() {
    var datas;

    (async () => {
      const res = await fetch("http://127.0.0.1:9090/api/datas.json");
      const json = await res.json();
      datas = json;
      console.log(json);
      this.datas = datas.slice(0, 30);
    })();
  }
};
</script>

<style>
.el-image {
  position: fixed;
  display: block;
  width: 100%;
  height: 128px;
  object-fit: cover;
  z-index: 999;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  height: 150px;
}
.el-container .el-container {
  margin-top: 128px;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.details {
  text-align: left;
}
.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
}
.el-main {
  background-color: #ff00cc;
  color: #333;
  text-align: center;
}
div > .el-container {
  margin-bottom: 40px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
