<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-header style="height: 55px">
        <div class="header-menu">
          <el-menu
            :default-active="$route.path"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#040b35"
            text-color="#8491a3"
            active-text-color="#ffffff"
            router
            ><div
              class="flex items-center ml-10 mr-2 md:mr-5 left-menu"
              style="float: left; height: 55px; cursor: pointer"
            >
              <img
                @click="$router.push('/')"
                style="width: 48px; height: 90%"
                src="./assets/round1.png"
              />
              <el-dropdown class="dropdown" trigger="click">
                <i
                  class="el-icon-arrow-down el-icon--right"
                  style="font-size: 20px"
                ></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    icon="el-icon-magic-stick"
                    @click.native="go()"
                    >文本生成草图</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div
              class="mr-5 sm:inline hidden"
              style="
                float: left;
                height: 42px;
                cursor: pointer;
                border-right: 2px solid #908f8f97;
                margin-top: 7.5px;
              "
            ></div>

            <div class="font-normal text-2xl float-right timedis2">
              {{ times }}&nbsp;&nbsp;{{ weekDay }}
            </div>
            <div
              class="mr-5 sm:inline hidden"
              style="
                float: right;
                height: 40px;
                cursor: pointer;
                border-right: 2px solid #888;
                margin-top: 7.5px;
              "
            ></div>
            <div
              class="mr-1 inline sm:hidden"
              style="
                float: right;
                height: 35px;

                border-right: 2px solid #888;
                margin-top: 5px;
              "
            ></div>
            <el-popover placement="bottom" width="250" trigger="click">
              <div class="detail w-full">
                <p>
                  <img
                    :src="imgSrc"
                    style="
                      width: 100px;
                      height: 100px;
                      display: inline-block;
                      vertical-align: initial;
                      position: absolute;
                      /* vertical-align: initial; */
                      margin-top: -1px;
                      margin-left: -15px;
                    "
                  />&nbsp;
                  <span class="h-full detail_temdis">
                    {{ weather.tem }}℃
                    <span class="detail_highdis"
                      >{{ weather.tem1 }}/{{ weather.tem2 }}</span
                    > </span
                  ><span
                    class="h-full flex justify-center flex-wrap"
                    style="width: 100px; margin-top: 10px"
                  >
                    <div class="wea_detail">{{ weather.wea }}</div>
                    <div class="container_aqi" id="container_aqi"></div
                  ></span>
                </p>
                <p>
                  <i
                    class="el-icon-location-information"
                    style="margin-right: 6px"
                  ></i
                  ><span class="name">您所在的城市:</span>&nbsp;&nbsp;{{
                    weather.city
                  }}
                </p>
                <p>
                  <i class="el-icon-wind-power" style="margin-right: 6px"></i>
                  <span class="name">风向:</span>&nbsp;&nbsp;<span>{{
                    weather.win
                  }}</span
                  >&nbsp;&nbsp;&nbsp;<span class="name">风力:&nbsp;&nbsp;</span
                  ><span>{{ weather.win_speed }}</span>
                </p>
                <p class="humidity">
                  <i class="el-icon-odometer" style="margin-right: 6px"></i>
                  <span class="name">湿度:&nbsp;&nbsp;</span
                  >{{ weather.humidity }} &nbsp;&nbsp;&nbsp;<span class="name"
                    >能见度:&nbsp;&nbsp;</span
                  >{{ weather.visibility }}
                </p>
                <p id="reporttime">
                  消息发布时间:&nbsp;&nbsp;{{ weather.date }}&nbsp;{{
                    weather.update_time
                  }}
                </p>
              </div>
              <div
                slot="reference"
                class="font-normal text-2xl float-right weatherdis flex items-center cursor-pointer"
              >
                <div class="h-full">
                  <img
                    v-if="this.imgSrc != null"
                    :src="imgSrc"
                    style="
                      height: 100%;
                      display: inline-block;
                      vertical-align: initial;
                    "
                  />
                </div>
                <div class="h-full temdis2">
                  {{ weather.tem }}℃
                  <span class="highdis2"
                    >{{ weather.tem1 }}/{{ weather.tem2 }}</span
                  >
                </div>
              </div>
            </el-popover>
            <el-menu-item index="/generate" class="hidden sm:inline">
              <span slot="title" class="hidden sm:inline"
                ><i
                  class="el-icon-magic-stick"
                  style="
                    font-size: 30px;
                    margin-right: 15px;
                    margin-top: -1.5px;
                  "
                ></i
                >文本生成草图</span
              ></el-menu-item
            >
          </el-menu>
        </div>
      </el-header>
      <el-main> <router-view /> </el-main
    ></el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  metaInfo: {
    title: "定义页面标题",
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, user-scalable=yes, initial-scale=0.3, maxmum-scale=1.0, minimum-scale=0.3",
      },
    ],
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  mounted() {
    this.getUpTime();
    // this.getip();
    // this.weekDay = this.getWeekDay();
    this.getWeather();
  },
  created() {
    this.getUpTime();
  },
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTime);
    }
  },
  computed: {
    xians() {
      return !(
        this.$route.path.includes("/main") ||
        this.$route.path.includes("/status")
      );
    },
  },
  data: () => ({
    routerAlive: true,
    activeIndex: "1",
    times: "",
    weekDay: "",
    weather: {},
    imgSrc: null,
    // xians: !this.$route.path.includes("/main"),
  }),
  methods: {
    go() {
      this.$router.push("/generate");
    },
    
    getUpTime() {
      setInterval(() => {
        this.getTime();
      }, 1000);
    },
    getWeekDay() {
      var weekNum = new Date(this.times.split(" ")[0]).getDay();
      var week = {
        0: "星期天",
        1: "星期一",
        2: "星期二",
        3: "星期三",
        4: "星期四",
        5: "星期五",
        6: "星期六",
      };
      return week[weekNum] ? week[weekNum] : "日期错误";
    },
    getTime() {
      // 获取当前时间
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var weekDay = this.getWeekDay();
      if (month < 10) month = "0" + month;
      if (day < 10) day = "0" + day;
      if (hour < 10) hour = "0" + hour;
      if (minute < 10) minute = "0" + minute;
      if (second < 10) second = "0" + second;
      this.weekDay = weekDay;
      this.times = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      this.weekDay = this.getWeekDay();
      // console.log(this.times);
    },
    // getip() {
    //   this.$axios
    //     .get("https://api.ipify.org/?format=json")
    //     .then((res) => {
    //       console.log(res.data.ip);
    //       this.getWeather();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    reload() {
      this.routerAlive = false;
      this.$nextTick(function () {
        this.routerAlive = true;
      });
    },
    getWeather() {
      this.$axios({
        method: "get",
        url: "https://v0.yiketianqi.com/api",
        params: {
          appid: "61585449",
          appsecret: "00PwPsx7",
          version: "v61",
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.weather = res.data;
          console.log(this.weather);
          // 换图标
          if (this.weather.wea_img == "xue") {
            this.imgSrc = require("./assets/icons/snowy-5.svg");
          }
          if (this.weather.wea_img == "lei") {
            this.imgSrc = require("./assets/icons/thunder.svg");
          }
          if (this.weather.wea_img == "yu") {
            this.imgSrc = require("./assets/icons/rainy-6.svg");
          }
          if (this.weather.wea_img == "yun") {
            this.imgSrc = require("./assets/icons/cloudy-day-3.svg");
          }
          if (this.weather.wea_img == "qing") {
            this.imgSrc = require("./assets/icons/day.svg");
          }
          if (this.weather.wea_img == "yin") {
            this.imgSrc = require("./assets/icons/cloudy.svg");
          }
          if (this.weather.wea_img == "bingbao") {
            this.imgSrc = require("./assets/icons/icon-hail.svg");
          }
          if (this.weather.wea_img == "shachen") {
            this.imgSrc = require("./assets/icons/icon-dust.svg");
          }
          this.$nextTick(() => {
            var container = document.getElementById("container_aqi");
            container.textContent = "空气质量" + "  " + this.weather.aqi.air;
            if (this.weather.aqi.air >= 0 && this.weather.aqi.air <= 50) {
              container.className = "container_aqi level1";
            } else if (
              this.weather.aqi.air >= 51 &&
              this.weather.aqi.air <= 100
            ) {
              container.className = "container_aqi level2";
            } else if (
              this.weather.aqi.air >= 101 &&
              this.weather.aqi.air <= 150
            ) {
              container.className = "container_aqi level3";
            } else if (
              this.weather.aqi.air >= 151 &&
              this.weather.aqi.air <= 200
            ) {
              container.className = "container_aqi level4";
            } else if (
              this.weather.aqi.air >= 201 &&
              this.weather.aqi.air <= 300
            ) {
              container.className = "container_aqi level5";
            } else {
              container.className = "container_aqi level6";
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped lang="scss">
*,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.el-header {
  padding: 0 0 0 0;
  background-color: #100c2a;
}
.el-main {
  padding: 0 0 0 0;
  height: calc(100vh - 55px);
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  overflow: auto;
}
.header-menu .el-menu--horizontal > .el-menu-item {
  font-size: 20px;
  height: 55px;
  line-height: 55px;
}
.header-menu :deep(.el-menu--horizontal) {
  border-bottom: solid 1px #e6e6e64a;
  -moz-box-shadow: 2px 3px 4px #a8a8a8;
  -webkit-box-shadow: 2px 3px 4px #a8a8a8;
  z-index: 2000;
  box-shadow: 5px 0px 4px #a8a8a8;
}
.header-menu .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 55px;
  line-height: 55px;
}
.temdis {
  padding-top: 11%;
  width: 47px;
  cursor: pointer;
  line-height: 17.5px;
  word-wrap: break-word;
  text-align: center;
}
.highdis {
  font-size: 13px;
}
.temdis2 {
  padding-top: 11%;
  width: 47px;
  cursor: pointer;
  line-height: 17.5px;
  word-wrap: break-word;
  text-align: center;
  color: #ffffff;
}
.highdis2 {
  color: #ffffff;
  font-size: 13px;
}
.weatherdis2 {
  cursor: default;
  font-size: 20px;
  height: 55px;
  line-height: 55px;
  color: #000;
  margin-right: 10px;
}
.timedis {
  cursor: default;
  // padding-top: 3px;
  font-size: 18px;
  height: 55px;
  line-height: 55px;
  color: #cee2f1;
  margin-right: 20px;
}

.timedis2 {
  cursor: default;
  // padding-top: 3px;
  font-size: 18px;
  height: 55px;
  line-height: 55px;
  color: #ffffff;
  margin-right: 20px;
}
.weatherdis {
  cursor: default;
  font-size: 20px;
  height: 55px;
  line-height: 55px;
  color: #cee2f1;
  margin-right: 10px;
}
.detail_temdis {
  margin-left: 70px;
  padding-top: 0px;
  margin-top: 10px;
  font-size: 23px;
  width: 60px;
  line-height: 24px;
  word-wrap: break-word;
  text-align: center;
}
.detail_highdis {
  font-size: 14px;
}
.wea_detail {
  font-size: 15.5px;
  font-weight: 700;
  width: 40px;
  margin-bottom: 3px;
}
.container_aqi {
  display: inline-block;
  padding: 5px 5px;
  border-radius: 10px;
  font-weight: bold;
  text-align: center;
  font-size: 13px;
}

.level1 {
  background-color: green;
  color: white;
}

.level2 {
  background-color: yellow;
  color: black;
}

.level3 {
  background-color: orange;
  color: white;
}

.level4 {
  background-color: red;
  color: white;
}

.level5 {
  background-color: purple;
  color: white;
}

.level6 {
  background-color: black;
  color: white;
}
.el-dropdown {
  display: none;
}
:deep(.el-dropdown-menu__item i) {
  font-size: 23px;
  vertical-align: middle;
}
@media screen and (max-width: 768px) {
  .el-main {
    padding: 0 0 0 0;
    height: calc(100vh - 45px) !important;
  }

  .timedis {
    font-size: 13.5px;
    margin-top: 2.5px;
    height: 40px;
    margin-right: 6px;
    // padding-top: 3px;
    line-height: 20px;
    width: 110px;
    color: #cee2f1;
    word-wrap: break-word;
    text-align: center;
  }
  .timedis2 {
    font-size: 13.5px;
    margin-top: 2.5px;
    height: 40px;
    margin-right: 6px;
    // padding-top: 3px;
    line-height: 20px;
    width: 110px;
    color: #ffffff;
    word-wrap: break-word;
    text-align: center;
  }
  .logo_text {
    display: none;
  }
  .logo_text_m {
    display: inline !important;
  }
  .el-header {
    height: 45px !important;
  }
  :deep(.el-menu .el-menu--horizontal) {
    border-bottom: solid 1px #e6e6e64a;
  }
  .el-dropdown-menu__item,
  .el-menu-item {
    padding: 0px 18px 0 13px;
    font-size: 16px;
  }
  .header-menu .el-menu--horizontal > .el-menu-item {
    font-size: 14px !important;
    height: 45px !important;
    line-height: 45px !important;
  }
  .header-menu .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 45px !important;
    line-height: 45px !important;
  }
  .left-menu {
    height: 45px !important;
    margin-left: 10px;
  }
  .temdis {
    padding-top: 0px;
    width: 47px;
    line-height: 20px;
    word-wrap: break-word;
    text-align: center;
  }
  .highdis {
    font-size: 13px;
  }

  .temdis2 {
    padding-top: 0px;
    width: 47px;
    line-height: 20px;
    word-wrap: break-word;
    text-align: center;
    color: #ffffff;
  }
  .highdis2 {
    color: #ffffff;
    font-size: 13px;
  }
  .weatherdis2 {
    cursor: pointer;
    font-size: 18px;
    margin-top: 2.5px;
    height: 40px;
    // padding-top: 3px;
    line-height: 40px;
    color: #000;
    margin-right: 10px;
  }

  .weatherdis {
    cursor: pointer;
    font-size: 18px;
    margin-top: 2.5px;
    height: 40px;
    // padding-top: 3px;
    line-height: 40px;
    color: #cee2f1;
    margin-right: 10px;
  }
  .el-dropdown {
    display: block;
    margin-left: 5px;
  }
}

.detail i {
  font-size: 25px;
}
.detail p {
  font-size: 14px;
  display: flex;
  align-items: center;
}
.detail p:nth-child(1) {
  margin-bottom: 20px;
}
.detail p:nth-child(n + 2) {
  margin-top: 10px;
  font-size: 14px;
  padding-left: 5px;
}

.name {
  font-weight: bold;
}
#reporttime {
  font-size: 12px;
  color: #999;
}
.el-main::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
  // background: #100c2a;
  background-color: rgba(255, 255, 255, 0);
}
.el-main::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 5px;
  // -webkit-box-shadow: inset 0 0 5px rgba(86, 83, 83, 0.629);
  background: rgba(86, 83, 83, 0.3);
}
.el-main::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5); //设置背景透明
}
</style>
