<template>
  <div>
    <div
      v-if="!isProcessing && !showResults"
      class="form_container md:w-10/12 w-11/12 md:px-8 py-6 px-4 flex flex-col"
    >
      <div class="flex flex-row justify-between items-center mb-4">
        <h3 class="tracking-wider">请详细描述您的艺术构想</h3>
        <span
          class="block cursor-pointer bg-white rounded-md pl-3 pr-2 py-2.5 text-sm leading-3 antialiased font-semibold text-left tracking-wider"
          style="color: rgba(0, 0, 0, 0.7)"
          @click="generatePrompt()"
          >Surprise Me 💡</span
        >
      </div>
      <el-input
        type="textarea"
        placeholder="Macaw full color,ultra detailed,realistic,insanely beautiful"
        v-model="textarea"
        :autosize="{ minRows: 5, maxRows: 5 }"
        maxlength="200"
        show-word-limit
      >
      </el-input>
      <div class="flex justify-center">
        <p
          v-if="!advancedSet"
          class="mb-4 mt-4 text-center antialiased font-normal text-base leading-6 text-blue-500"
        >
          <span class="cursor-pointer" @click="advanceSet()"
            >+ Advanced Settings</span
          >
        </p>
      </div>
      <div
        v-show="advancedSet"
        class="flex flex-col md:flex-row md:justify-between mt-5 settings"
        :class="advanced == false ? 'off' : 'on'"
      >
        <div
          class="flex flex-row justify-between items-center indeSet"
          style="width: 33%; padding-right: 20px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                笔画数默认为8，最大为20，最小为2<br />超出范围将自动取最大或最小值
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >自定义笔画数
          </h3>
          <el-input-number
            v-model="NumberOfStrokes"
            :min="2"
            :max="20"
            style="width: 55%"
          ></el-input-number>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet"
          style="width: 33%; padding-right: 20px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                自由度默认为80%，最大为100%，最小为10%<br />最多支持输入两位小数
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >自定义自由度
          </h3>
          <el-input
            v-model="flexibility"
            @input="limitInput($event)"
            style="width: 55%"
          >
            <i
              slot="suffix"
              style="
                font-style: normal;
                margin-right: 10px;
                color: #000;
                size: 15px;
              "
              >%</i
            >
          </el-input>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet"
          style="width: 33%; padding-right: 0px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                可以自定义生成图片的风格<br />默认为随机风格
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >自定义风格化
          </h3>
          <el-select v-model="styleDiy" placeholder="请选择" style="width: 55%">
            <el-option
              v-for="item in styleList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              ><el-image
                class="option_img"
                :src="item.value"
                :preview-src-list="item.srcList"
                fit="contain"
                style="float: left; width: 60px; height: 45px"
              ></el-image>
              <span style="float: right; font-size: 16px">{{
                item.label
              }}</span>
            </el-option></el-select
          >
        </div>
      </div>
      <div class="flex justify-center">
        <p
          v-if="advancedSet"
          class="mb-4 mt-4 text-center antialiased font-normal text-base duration-200 leading-6 text-gray-500"
        >
          <span class="cursor-pointer" @click="advanceSet()"
            >- Hide Advanced Settings</span
          >
        </p>
      </div>
      <div class="flex justify-center" v-if="textarea == ''">
        <el-button
          type="info"
          disabled
          style="font-size: 18px; font-weight: 500"
          ><i
            class="el-icon-stars"
            style="font-size: 20px; margin-right: 10px"
          ></i
          >立即开始艺术创作
        </el-button>
      </div>
      <div class="flex justify-center" v-else>
        <el-button
          type="primary"
          style="font-size: 18px; font-weight: 500"
          @click="generatePic()"
          ><i
            class="el-icon-stars"
            style="font-size: 20px; margin-right: 10px"
          ></i
          >立即开始艺术创作
        </el-button>
      </div>
    </div>
    <div
      v-if="isProcessing && !showResults"
      class="form_container_process md:w-10/12 w-11/12 md:px-8 pt-6 pb-4 px-4 flex flex-col"
    >
      <div class="flex flex-col md:flex-row justify-around items-center mb-4">
        <div
          class="w-11/12 md:w-1/2 h-full items-center leftdis flex flex-col justify-center"
        >
          <el-carousel
            :autoplay="false"
            indicator-position="outside"
            style="width: 92.5%; margin-top: 1rem"
            @change="onChange"
          >
            <el-carousel-item v-for="item in displayList" :key="item.key">
              <img :src="item.src" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
          <p class="font-medium tracking-wider mb-3" style="width: 92.5%">
            {{ displayList[curIndex].text }}
          </p>
          <div style="width: 92.5%" class="pb-3">
            <el-button
              class="likebutton"
              style="width: 100%"
              v-if="!isLiked[curIndex]"
              @click="likeit()"
              ><i class="el-icon-dianzan1 mr-1" style="font-size: 17px"></i
              >喜欢</el-button
            >
            <el-button
              class="liked"
              type="text"
              style="width: 100%"
              v-if="isLiked[curIndex]"
              @click="likeit()"
              ><i class="el-icon-dianzan1 mr-1" style="font-size: 17px"></i
              >喜欢</el-button
            >

            <!-- <p class="flex justify-center" v-else>
              <span class="liked mb-1"
                ><i class="el-icon-dianzan1 mr-1" style="font-size: 17px"></i
                >喜欢</span
              >
            </p> -->
          </div>
        </div>
        <PlanetLoading></PlanetLoading>
      </div>
    </div>
    <div
      v-if="!isProcessing && showResults"
      class="form_container_process md:w-10/12 w-11/12 md:px-8 pt-6 pb-4 px-4 flex flex-col"
    >
      <div class="mb-3">
        <el-page-header @back="goBack()" content="生成结果"> </el-page-header>
      </div>
      <div class="flex flex-row justify-between">
        <el-input
          placeholder="Macaw full color,ultra detailed,realistic,insanely beautiful"
          v-model="textarea"
          maxlength="200"
          class="inputKuang"
        >
        </el-input>
        <el-button
          type="primary"
          size="small"
          style="font-size: 18px; font-weight: 500"
          @click="generatePic()"
          ><i class="el-icon-stars" style="font-size: 20px"></i
          ><span class="hidden-sm-and-down" style="margin-left: 10px"
            >立即开始艺术创作</span
          >
        </el-button>
      </div>
      <div class="flex justify-center">
        <p
          v-if="!advancedSet2"
          class="mb-4 mt-4 text-center antialiased font-normal text-base leading-6 text-blue-500"
        >
          <span class="cursor-pointer" @click="advanceSet()"
            >+ Advanced Settings</span
          >
        </p>
      </div>
      <div
        v-show="advancedSet2"
        class="flex flex-col md:flex-row md:justify-between mt-5 settings"
        :class="advanced2 == false ? 'off' : 'on'"
      >
        <div
          class="flex flex-row justify-between items-center indeSet"
          style="width: 33%; padding-right: 20px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                笔画数默认为8，最大为20，最小为2<br />超出范围将自动取最大或最小值
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >自定义笔画数
          </h3>
          <el-input-number
            v-model="NumberOfStrokes"
            :min="2"
            :max="20"
            style="width: 55%"
          ></el-input-number>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet"
          style="width: 33%; padding-right: 20px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                自由度默认为80%，最大为100%，最小为10%<br />最多支持输入两位小数
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >自定义自由度
          </h3>
          <el-input
            v-model="flexibility"
            @input="limitInput($event)"
            style="width: 55%"
          >
            <i
              slot="suffix"
              style="
                font-style: normal;
                margin-right: 10px;
                color: #000;
                size: 15px;
              "
              >%</i
            >
          </el-input>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet"
          style="width: 33%; padding-right: 0px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                可以自定义生成图片的风格<br />默认为随机风格
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >自定义风格化
          </h3>
          <el-select v-model="styleDiy" placeholder="请选择" style="width: 55%">
            <el-option
              v-for="item in styleList"
              :key="item.label"
              :label="item.label"
              :value="item.label"
              ><el-image
                class="option_img"
                :src="item.value"
                :preview-src-list="item.srcList"
                fit="contain"
                style="float: left; width: 60px; height: 45px"
              ></el-image>
              <span style="float: right; font-size: 16px">{{
                item.label
              }}</span>
            </el-option></el-select
          >
        </div>
      </div>
      <div class="flex justify-center">
        <p
          v-if="advancedSet2"
          class="mb-4 mt-4 text-center antialiased font-normal text-base duration-200 leading-6 text-gray-500"
        >
          <span class="cursor-pointer" @click="advanceSet()"
            >- Hide Advanced Settings</span
          >
        </p>
      </div>
      <div class="flex flex-row flex-wrap justify-around w-full">
        <div
          class="flex flex-col w-full md:w-1/2 imageContainer"
          v-for="item in resultList"
          :key="item.label"
        >
          <el-image
            :src="item.value"
            :preview-src-list="item.srcList"
            fit="cover"
            style="width: 100%; height: 90%"
            class="result_img"
            lazy
          ></el-image
          ><el-image-viewer
            class="image_viewer"
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="srcList"
          ></el-image-viewer>
          <div class="flex mt-2 justify-between">
            <el-button type="success" style="width: 47%" @click="preview(item)"
              ><i class="el-icon-search mr-1"></i>放大预览</el-button
            ><el-button
              type="primary"
              style="width: 47%"
              @click="click_down_excel(item.value)"
            >
              <i class="el-icon-download mr-1"></i>下载图片</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PlanetLoading from "@/components/PlanetLoading.vue";
import loading1 from "../components/loading1.vue";
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  name: "generate",
  components: {
    loading1,
    PlanetLoading,
    ElImageViewer,
  },
  data() {
    return {
      prompt: "",
      textarea: "",
      isProcessing: false,
      showResults: true,
      advanced: false,
      advanced2: true,
      NumberOfStrokes: 8,
      flexibility: 80,
      advancedSet: false,
      advancedSet2: true,
      showViewer: false, // 显示查看器
      curIndex: 0,
      isLiked: [false, false, false, false],
      styleDiy: "素描草图",
      srcList: [],
      styleList: [
        {
          value: require("../assets/sketch.png"),
          label: "素描草图",
          srcList: [require("../assets/sketch.png")],
        },
        {
          value: require("../assets/color.png"),
          label: "色彩丰富",
          srcList: [require("../assets/color.png")],
        },
        {
          value: require("../assets/oil.png"),
          label: "油画绘制",
          srcList: [require("../assets/oil.png")],
        },
      ],
      resultList: [
        {
          // value: require("../assets/sketch.png"),
          value:
            "https://fengru-pic.oss-cn-beijing.aliyuncs.com/00140634-e675-4a85-af2a-0ee4e434c7e2.png",
          label: "素描草图",
          srcList: [require("../assets/sketch.png")],
        },
        {
          value: require("../assets/color.png"),
          label: "色彩丰富",
          srcList: [require("../assets/color.png")],
        },
        {
          value: require("../assets/oil.png"),
          label: "油画绘制",
          srcList: [require("../assets/oil.png")],
        },
        {
          value: require("../assets/oil.png"),
          label: "油画绘制",
          srcList: [require("../assets/oil.png")],
        },
        {
          value: require("../assets/oil.png"),
          label: "油画绘制",
          srcList: [require("../assets/oil.png")],
        },
      ],
      displayList: [
        {
          src: require("../assets/oil.png"),
          key: 1,
          text: "Very detailed masterpiece painting of baby yoda holding a lightsaber",
        },
        {
          src: require("../assets/sketch.png"),
          key: 2,
          text: "A fox is sitting on the sofa",
        },
        {
          src: require("../assets/color.png"),
          key: 3,
          text: "Colorful hot air balloons high over the mountains",
        },
        {
          src: require("../assets/oil.png"),
          key: 4,
          text: "A cute cat in the style of Pixar animations rides a bike",
        },
      ],
    };
  },
  methods: {
    generatePrompt() {
      var promptList = [
        "Very detailed masterpiece painting of baby yoda holding a lightsaber",
        "A fox is sitting on the sofa",
        "Colorful hot air balloons high over the mountains",
        "A cute cat in the style of Pixar animations rides a bike",
        "Real photo of Sydney opera house",
        "A sketching with watercolors of a modern Athens neighborhood",
        "Macaw full color,ultra detailed,realistic,insanely beautiful",
        "Sailboat sailing in the sea on a clear day",
        "Portrait of Latin woman having a spiritual awakening,eyes closed, slight smile,illuminating lights,oil painting,by Van Gogh",
      ];
      var random = Math.floor(Math.random() * promptList.length);
      this.textarea = promptList[random];
      // this.$notify({
      //   title: "成功",
      //   message: "生成成功",
      //   type: "success",
      //   offset: 100,
      //   duration: 2000,
      // });
    },
    advanceSet() {
      this.advanced = !this.advanced;
      this.advanced2 = !this.advanced2;
      if (!this.advancedSet2) {
        this.advancedSet2 = !this.advancedSet2;
      } else {
        setTimeout(() => {
          this.advancedSet2 = !this.advancedSet2;
        }, 500);
      }
      if (!this.advancedSet) {
        this.advancedSet = !this.advancedSet;
      } else {
        setTimeout(() => {
          this.advancedSet = !this.advancedSet;
        }, 500);
      }
    },
    perFormat(value) {
      return `${value}%`;
    },
    limitInput(value) {
      let aa =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d{0,2}(\.?\d{0,2})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
      // 是个数字
      if (Number(aa)) {
        // 小于100大于0正确
        if (0 < Number(aa) && Number(aa) < 100) {
          console.log(1, aa);
          this.flexibility = aa;
        } else {
          // 大于100直接将第三个删掉替换为前两个字符组。触发字符100.25等
          console.log(2, aa);
          // this.zzbds = aa.splice(3,1)
          this.flexibility = aa.replace(/(.{2})./g, "$1");
        }
      } else {
        // 不是个数，比如abd、0......等，原因是上面的判断覆盖了一部分正则校验
        if (aa != "0.") {
          // 不是0.开头的，比如字母等直接替换为空。触发字符abds等
          this.flexibility = "";
          console.log("zm", aa);
        } else {
          // 是0.开头的换为0.，触发字符0......等
          this.flexibility = aa;
          console.log("sm", aa);
        }
      }
      console.log("最终结果", this.flexibility);
    },
    generatePic() {
      var set = {
        textarea: this.textarea,
        NumberOfStrokes: this.NumberOfStrokes,
        flexibility: this.flexibility,
        styleDiy: this.styleDiy,
      };
      setTimeout(() => {
        this.isProcessing = !this.isProcessing;
      }, 500);
      setTimeout(() => {
        this.isProcessing = !this.isProcessing;
        this.showResults = !this.showResults;
      }, 2200);
      console.log(set);
    },
    onChange(curVal, oldVal) {
      this.curIndex = curVal;
      console.log(curVal, oldVal);
    },
    likeit() {
      this.isLiked[this.curIndex] = true;
      this.$forceUpdate();
    },
    goBack() {
      this.showResults = !this.showResults;
    },
    click_down_excel(url) {
      console.log(url);
      let dom = document.createElement("a");
      dom.href = url;
      // 提取出第一个点前的文字
      let name = url.substring(5, url.indexOf("."));
      // 提取出最后一个点后的文字
      let suffix = url.substring(url.lastIndexOf(".") + 1);

      dom.download = name + "." + suffix;
      dom.style.display = "none"; // 隐藏a标签
      document.body.appendChild(dom);
      // 点击下载
      dom.click();
      document.body.removeChild(dom);
    },
    preview(val) {
      // console.log(document.querySelectorAll(".result_img"));
      // console.log(document.querySelectorAll(".result_img")[index].showViewer);
      console.log(val);
      this.srcList = val.srcList;
      this.showViewer = true;
      // document.querySelectorAll(".result_img")[index].clickHandler();
    },
    showImage(val) {
      console.log(val);
      this.srcList = val.srcList;
      this.showViewer = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showViewer = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.form_container {
  margin: 3% auto 0 auto;
  // height: 95%;
  box-shadow: 0 0 8px 0 rgba(29, 41, 83, 0.08),
    0 1px 72px 0 rgba(4, 11, 53, 0.1);
  border-radius: 0.75rem;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(231, 237, 251, var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgba(233, 237, 243, var(--tw-bg-opacity));
}
.form_container_process {
  margin: 2% auto 35px auto;
  // height: 95%;
  box-shadow: 0 0 8px 0 rgba(29, 41, 83, 0.08),
    0 1px 72px 0 rgba(4, 11, 53, 0.1);
  border-radius: 0.75rem;
  border-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgba(231, 237, 251, var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgba(233, 237, 243, var(--tw-bg-opacity));
}
:deep(.el-textarea__inner) {
  padding-top: 15px;
  padding-right: 20px;
  padding-left: 20px;
  font-size: 15px;
  color: #000;
}
:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}
:deep(.el-page-header__left) {
  margin-right: 23px;
}
:deep(.el-page-header__content) {
  font-size: 15px;
  color: #303133;
}
:deep(.el-page-header__left::after) {
  position: absolute;
  width: 1px;
  height: 16px;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #aab2c5;
}
.el-select-dropdown__item {
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  padding: 0 10px 0 10px;
}
.el-select-dropdown__item:last-child {
  border-bottom: none;
}
.settings {
  height: 0;
  overflow: hidden;
}
.inputKuang {
  width: 78%;
}
.imageContainer {
  height: 480px;
}
.imageContainer:nth-child(odd) {
  padding: 10px 15px 25px 80px;
} //奇数行

.imageContainer:nth-child(even) {
  padding: 10px 80px 25px 15px;
}
:deep(.el-image-viewer__mask) {
  background: #0000007a;
}
@keyframes unfold {
  from {
    height: 0px;
  }
  to {
    height: 45px;
  }
}

@keyframes shrink {
  from {
    height: 45px;
  }
  to {
    height: 0px;
  }
}
.on {
  height: 45px;
  animation: unfold 0.5s 1 ease-out;
}
.off {
  height: 0px;
  animation: shrink 0.5s 1 ease-out;
}
@media screen and (max-width: 768px) {
  .form_container {
    margin-top: 8%;
  }
  .inputKuang {
    width: 78%;
  }

  .form_container_process {
    margin: 35px auto 35px auto;
    // height: 95%;
  }
  .imageContainer {
    height: 380px;
  }
  .imageContainer:nth-child(0) {
    padding: 15px 10px 5px 10px;
  }
  .imageContainer:nth-child(odd) {
    padding: 0px 10px 15px 10px;
  } //奇数行

  .imageContainer:nth-child(even) {
    padding: 0px 10px 15px 10px;
  }
  .indeSet {
    width: 100% !important;
    padding-right: 0px !important;
    margin-top: 15px;
  }
  @keyframes unfold {
    from {
      height: 0px;
    }
    to {
      height: 180px;
    }
  }

  @keyframes shrink {
    from {
      height: 180px;
    }
    to {
      height: 0px;
    }
  }
  .on {
    height: 180px;
    animation: unfold 0.5s 1 ease-out;
  }
  .off {
    height: 0px;
    animation: shrink 0.5s 1 ease-out;
  }
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
/deep/ .el-carousel__button {
  // 指示器按钮
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
}
/deep/ .is-active .el-carousel__button {
  // 指示器激活按钮
  background: #3f8ec8;
}
.leftdis {
  --tw-shadow: 0px 3.7112px 13.917px rgba(0, 0, 0, 0.25);
  --tw-shadow-colored: 0px 3.7112px 13.917px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  border-radius: 10px;
  background: #fff;
}
.likebutton {
  border: none;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  --tw-shadow: 0px 1px 10px rgba(5, 25, 51, 0.12);
  --tw-shadow-colored: 0px 1px 10px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.liked {
  --color-1: #186cb8;
  --color-2: #2a9a9f;
  --color-3: #f1b211;
  --color-4: #e83611;
  --color-5: #f9002f;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  background: linear-gradient(
    to right,
    var(--color-1),
    var(--color-2),
    var(--color-3),
    var(--color-4),
    var(--color-5)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
