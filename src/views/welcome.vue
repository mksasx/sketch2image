<template>
  <div class="h-full">
    <section class="relative sm:h-full h-5/6">
      <div
        class="text-container absolute flex z-0 items-center justify-center text-center w-full h-full top-0 left-0"
      >
        <div class="z-10 container2 w-full mx-auto py-3">
          <p class="sm:text-4xl font-bold tracking-widest mb-7 text-3xl">
            智能高效
          </p>
          <h1 class="sm:text-6xl font-semibold tracking-widest mb-5 text-4xl">
            风力发电预测平台
          </h1>
          <p class="text-2xl leading-normal mb-3 pb-1">
            睿风 - 科技赋能风力发电
          </p>
          <el-button round type="primary" @click="$router.push('/main')">
            开始使用
          </el-button>
        </div>
      </div>
    </section>
    <section
      class="relative section-outer1 section-outer h-5/6 sm:h-screen text-center py-2 sm:text-left sm:py-0"
    >
      <div class="container2 py-2 sm:py-0 h-full">
        <div class="flex items-center justify-center h-full">
          <div
            class="items-center justify-center flex flex-wrap flex-row flex-auto h-full content-center"
          >
            <div class="col-sm-5 mb-4 sm:mb-0">
              <h2
                class="text-3xl sm:text-6xl font-bold leading-4 tracking-widest mb-7 sm:mb-10"
              >
                实时数据
              </h2>
              <p
                class="text-xl sm:text-3xl text-gray-500 mb-7 tracking-wider sm:mb-10"
              >
                海量真实风力发电数据
              </p>
              <ul
                class="list-none text-gray-500 mb-4 font-semibold text-sm tracking-wider sm:text-xl"
              >
                <li class="leading-8">
                  · 全球最大风电运营企业龙源电力提供数据支持
                </li>
                <li class="leading-8">
                  · 为电网调度提供科学支撑 保障电力供需平衡
                </li>
                <li class="leading-8">· 促进以新能源为主体的电力体制改革</li>
              </ul>
              <el-button round type="primary" @click="$router.push('/main')">
                开始使用
              </el-button>
            </div>
            <div class="col-sm-7">
              <div>
                <div class="embed-responsive embed-responsive-custom">
                  <img src="../assets/bg2.jpg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section
      class="section-outer1 section-outer h-5/6 sm:h-screen text-center py-2 sm:text-left sm:py-0"
    >
      <div class="container2 py-2 sm:py-0 h-full">
        <div class="flex items-center justify-center h-full">
          <div
            class="items-center justify-center flex flex-wrap flex-row flex-auto h-full content-center"
          >
            <div class="col-sm-7 order-2 sm:order-1">
              <div>
                <div class="embed-responsive embed-responsive-custom">
                  <img src="../assets/second.jpg" />
                </div>
              </div>
            </div>
            <div class="col-sm-5 mb-4 sm:mb-0 order-1 sm:order-2">
              <h2
                class="text-3xl sm:text-6xl font-bold leading-4 tracking-widest mb-7 sm:mb-10"
              >
                滚动预测
              </h2>
              <p
                class="text-xl sm:text-3xl text-gray-500 mb-7 tracking-wider sm:mb-10"
              >
                可定制高准度预测模型
              </p>
              <ul
                class="list-none text-gray-500 mb-4 font-semibold text-sm tracking-wider sm:text-xl"
              >
                <li class="leading-8">· 深度学习网络融合时序模型</li>
                <li class="leading-8">· 预测结果可视化展示</li>
                <li class="leading-8">· 多屏幕多尺寸响应式设计</li>
              </ul>
              <el-button round type="primary" @click="$router.push('/main')">
                开始使用
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="bottom-section py-8">
      <div class="py-lg-5 container2 text-center">
        <h2
          class="sm:text-5xl text-3xl tracking-widest font-bold text-center text-white mb-4"
        >
          现在使用睿风
          <br class="sm:hidden" />
          开始智能预测
        </h2>
        <div class="text-red">
          <el-button round type="primary" @click="$router.push('/main')">
            开始使用
          </el-button>
        </div>
      </div>
    </section>
    <el-divider content-position="center"> © 2023 睿风科技有限公司</el-divider>
  </div>
</template>

<script>
// import $ from "jquery";
export default {
  mounted() {
    // 初始化wow
    // new this.$wow.WOW().init();
    console.log(this.$route.path);
  },
  methods: {
    goMain() {
      this.$router.push({
        name: "main",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.footer {
  margin: 24px 0;
  color: #a8a8a8;
  font-size: 12px;
  line-height: 1;
  text-align: center;
}
.text-container {
  position: absolute;
  top: 0;
  left: 0;
}
.text-container:after {
  background-image: url("../assets/banner1.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  mask-image: linear-gradient(
    0deg,
    rgba(226, 233, 255, 0.5),
    rgba(226, 233, 255, 0.5)
  );
}
.section-outer1 {
  background-image: url("../assets/section-bg1.png");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
:deep(.el-divider__text) {
  padding: 0 7px;
}
.container2 {
  max-width: 86%;
  margin: 0 auto;
}
.bottom-section {
  background-image: url("../assets/bottom.jpg");
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}
.col-sm-7,
.col-sm-5 {
  position: relative;
  padding-left: 15px;
  padding-right: 15px;
}
.embed-responsive {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
}
.embed-responsive img {
  /* position: absolute;
  top: 0;
  left: 0; */
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 1.875rem;
  z-index: 10;
  /* opacity: 1; */
  transition: all 0.2s ease-in-out;
}
@media screen and (min-width: 640px) {
  .container2 {
    max-width: 85%;
    margin: 0 auto;
  }
  .col-sm-5 {
    max-width: 42.5%;
    flex: 0 0 42.5%;
    margin-left: 3%;
  }
  .col-sm-7 {
    max-width: 51.8%;
    flex: 0 0 51.8%;
  }
}
</style>
