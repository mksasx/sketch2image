<template>
  <div>
    <div
      v-if="!isProcessing && !showResults"
      class="form_container md:w-10/12 w-11/12 md:px-8 py-6 px-4 flex flex-col items-center"
    >
      <div
        class="flex flex-row justify-between items-center mb-4 w-full"
        style="word-break: break-all"
      >
        <span v-if="lang == '中'" class="tracking-wider text-sm font-medium"
          >这是一个基于<a
            target="\_blank"
            href="https://ximinng.github.io/DiffSketcher-project/#"
            class="underline text-blue-600"
            >DiffSketcher: Text Guided Vector Sketch Synthesis through Latent
            Diffusion Models</a
          >这篇论文的在线Demo。使用DiffSketcher，您可以通过输入自然语言的方式来创建矢量化手绘草图，并且支持不同风格的切换以及个性化参数设置。请输入生动、较强描述性的200字符以内的英文文本内容，大约需要5分钟来完成1000轮迭代。
        </span>
        <span v-else class="tracking-wider text-sm font-medium"
          >A demo for
          <a
            target="\_blank"
            href="https://ximinng.github.io/DiffSketcher-project/#"
            class="underline text-blue-600"
            >DiffSketcher: Text Guided Vector Sketch Synthesis through Latent
            Diffusion Models.</a
          >
          By using DiffSketcher, you can create vectorized free-hand sketches
          using natural language input. Please enter a descriptive and vivid
          English prompt within 200 characters, it will take ~5 minutes to
          perform 1000 iterations.</span
        >
      </div>
      <div class="flex flex-row justify-between items-center mb-4 w-full">
        <span class="text-lg font-medium">{{
          lang == "中" ? "请描述您的艺术构想" : "Your artistic vision"
        }}</span>
        <span
          class="block cursor-pointer bg-white rounded-md pl-2 pr-2 py-2.5 text-sm leading-3 antialiased font-semibold text-left tracking-wider"
          style="color: rgba(0, 0, 0, 0.7)"
          @click="generatePrompt()"
          >{{ lang == "中" ? "提示我 💡" : "Surprise Me 💡" }}</span
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
          <span class="cursor-pointer" @click="advanceSet()">{{
            lang == "中" ? "+ 个性化设置" : "+ Advanced Settings"
          }}</span>
        </p>
      </div>
      <div
        v-show="advancedSet"
        class="flex flex-col md:flex-row md:justify-between mt-5 settings flex-wrap w-full"
        :class="advanced == false ? 'off' : 'on'"
      >
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 100%"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                {{
                  lang == "中"
                    ? "笔画数控制了作图的精细程度"
                    : "The number of strokes controls the fineness of the drawing"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "自定义笔画数" : "Number of strokes" }}
          </h3>
          <!-- <el-input-number
            v-model="NumberOfStrokes"
            :min="1"
            style="width: 55%"
          ></el-input-number> -->
          <el-slider
            class="hidden-sm-and-down"
            v-model="NumberOfStrokes"
            style="width: 85%"
            show-input
            :min="30"
            :max="200"
            :marks="marks1"
          ></el-slider>
          <el-slider
            class="w-11/12 hidden-sm-and-up"
            style="margin: 0 auto"
            v-model="NumberOfStrokes"
            :min="30"
            :max="200"
            :marks="marks1"
          >
          </el-slider>
        </div>

        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 100%"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "为了提高体验，防止等待时间过长,迭代轮数默认为1000，最小为100，最大为2400"
                    : "In order to improve the experience and prevent the waiting time from being too long.The default number of iteration rounds is 1000, the minimum is 100, and the maximum is 2400"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{
              lang == "中" ? "自定义迭代轮数" : "Number of iteration rounds"
            }}
          </h3>
          <el-slider
            class="hidden-sm-and-down"
            :style="[{ width: lang == '中' ? '85%' : '80%' }]"
            v-model="NumOfIterations"
            show-input
            :min="100"
            :max="2400"
            :step="100"
            :marks="marks3"
          >
          </el-slider>
          <el-slider
            class="w-89/100 hidden-sm-and-up"
            style="margin: 0 auto"
            v-model="NumOfIterations"
            :min="100"
            :max="2400"
            :step="100"
            :marks="marks3"
          >
          </el-slider>
          <!-- <el-input
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
          </el-input> -->
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet special"
          style="width: 32%; padding-right: 0px; margin-top: 10px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "可以自定义生成图片的风格,默认为素描草图风格"
                    : "You can customize the style of generated pictures.The default is sketch style"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "自定义风格" : "Custom style" }}
          </h3>
          <el-select v-model="styleDiy" placeholder="请选择" style="width: 55%">
            <el-option
              v-for="item in styleList"
              :key="item.value"
              :label="lang == '中' ? item.label : item.label_en"
              :value="item.value"
              ><el-image
                class="option_img"
                :src="item.pic"
                :preview-src-list="item.srcList"
                fit="contain"
                style="float: left; width: 60px; height: 45px"
              ></el-image>
              <span style="float: right; font-size: 16px">{{
                lang == "中" ? item.label : item.label_en
              }}</span>
            </el-option></el-select
          >
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 32%; margin-top: 10px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "Clip损失强度默认为0.1，最小为0，最大为1.0"
                    : "Clip loss strength is 0.1 by default, the minimum is 0, and the maximum is 1.0"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "Clip损失强度" : "Clip Loss Strength" }}
          </h3>

          <el-input-number
            v-model="ClipLoss"
            :precision="1"
            :step="0.1"
            :min="0.0"
            :max="1.0"
            style="width: 55%"
          ></el-input-number>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 32%; margin-top: 10px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "SDS损失强度默认为1.0，最小为0，最大为2"
                    : "The SDS loss strength defaults to 1.0, the minimum is 0, and the maximum is 2"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "SDS损失强度" : "SDS Loss Strength" }}
          </h3>
          <el-input-number
            v-model="SDSLoss"
            :precision="1"
            :step="0.1"
            :min="0.0"
            :max="2.0"
            style="width: 55%"
          ></el-input-number>
          <!-- <el-input
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
          </el-input> -->
        </div>
      </div>
      <div class="flex justify-center">
        <p
          v-if="advancedSet"
          class="mb-4 mt-4 text-center antialiased font-normal text-base duration-200 leading-6 text-gray-500"
        >
          <span class="cursor-pointer" @click="advanceSet()">{{
            lang == "中" ? "- 个性化设置" : "- Hide Advanced Settings"
          }}</span>
        </p>
      </div>
      <div class="flex justify-center mb-3">
        <el-button
          v-if="textarea == ''"
          type="info"
          disabled
          style="font-size: 18px; font-weight: 500"
          ><i
            class="el-icon-stars"
            style="font-size: 20px; margin-right: 10px"
          ></i
          >{{ lang == "中" ? "立即开始艺术创作" : "Start creating art now" }}
        </el-button>
        <el-button
          v-else
          type="primary"
          style="font-size: 18px; font-weight: 500"
          @click="generatePic(), generate2()"
          ><i
            class="el-icon-stars"
            style="font-size: 20px; margin-right: 10px"
          ></i
          >{{ lang == "中" ? "立即开始艺术创作" : "Start creating art now" }}
        </el-button>
      </div>
      <div class="w-full mt-2">
        <p class="tracking-wider text-2xl font-medium exampleText">
          {{
            lang == "中" ? "DiffSketch作品示例" : "Example of DiffSketch work"
          }}
        </p>
      </div>
      <div class="flex-col flex md:flex-row w-full justify-around flex-wrap">
        <div
          class="w-full h-full md:w-3/10 items-center leftdis flex flex-col justify-center"
          v-for="item in displayList.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )"
          :key="item.src"
        >
          <el-image
            :src="item.src"
            :preview-src-list="item.srcList"
            fit="cover"
            lazy
            style="
              border: 2px solid rgba(0, 0, 0, 0.7);
              width: 90%;
              margin-top: 1.2rem;
              margin-bottom: 1rem;
              height: 100%;
            "
          ></el-image>
          <!-- <el-carousel
            :autoplay="false"
            indicator-position="outside"
            style="width: 90%; margin-top: 1rem"
            @change="onChange"
          >
            <el-carousel-item v-for="item in displayList" :key="item.key">
              <el-image
                :src="item.src"
                style="width: 100%; height: 100%"
              ></el-image>
            </el-carousel-item>
          </el-carousel> -->

          <div
            class="font-medium tracking-wider"
            style="
              width: 90%;

              word-break: break-all;
              margin-bottom: 1.25rem;
            "
          >
            <p class="mb-1.5">
              <span class=" "
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "提示词:" : "Prompt:" }}&nbsp;</span
                >{{ item.text }}</span
              >
            </p>
            <p class="mb-1.5 flex justify-between">
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "风格:" : "Style:" }}&nbsp;</span
                >{{ lang == "中" ? item.StyleText : item.StyleText_en }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "笔画数:" : "StrokeNum:" }}&nbsp;</span
                >{{ item.NumberOfStrokes }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{
                    lang == "中" ? "控制点数:" : "ControlPoint:"
                  }}&nbsp;</span
                >{{ item.NumberOfControlPoints }}</span
              >
            </p>
            <p class="flex justify-between">
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "迭代数:" : "Iterations:" }}&nbsp;</span
                >{{ item.NumOfIterations }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "CLIP损失:" : "CLipLoss:" }}&nbsp;</span
                >{{ item.ClipLoss }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "SDS损失:" : "SDSLoss:" }}&nbsp;</span
                >{{ item.SDSLoss }}</span
              >
            </p>
          </div>

          <!-- <div style="width: 90%" class="pb-3">
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
          </div> -->
        </div>
      </div>
      <el-pagination
        class="mt-2"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="this.displayList.length"
      />
    </div>
    <div
      v-if="isProcessing && !showResults"
      class="form_container_process md:w-2/3 w-11/12 md:pl-4 md:pr-6 pt-6 pb-8 px-4 flex flex-col md:flex-row justify-around items-center"
    >
      <div
        v-if="iteration.src != null"
        class="w-full h-4/5 md:w-9/20 items-center leftdis1 flex flex-col justify-center"
      >
        <p class="mt-2">Iter:{{ curIter }}/{{ totIter }}</p>
        <el-image
          :src="iteration.src"
          :preview-src-list="iteration.srcList"
          fit="cover"
          lazy
          style="
            border: 2px solid rgba(0, 0, 0, 0.7);
            width: 80%;
            margin-bottom: 1rem;
            /* margin-top: 1rem; */
            height: 70%;
          "
        >
          <div
            slot="error"
            class="image-slot h-2/3 flex-col flex items-center justify-center"
          >
            <div class="mb-3">
              <i class="el-icon-picture-outline" style="font-size: 70px"></i>
            </div>
            <p class="font-medium text-2xl">
              {{ lang == "中" ? "正在加载中..." : "Loading..." }}
            </p>
          </div></el-image
        >
        <!-- <el-carousel
            :autoplay="false"
            indicator-position="outside"
            style="width: 90%; margin-top: 1rem"
            @change="onChange"
          >
            <el-carousel-item v-for="item in displayList" :key="item.key">
              <img :src="item.src" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
          <p class="font-medium tracking-wider mb-3" style="width: 90%">
            {{ displayList[curIndex].text }}
          </p>
          <div style="width: 90%" class="pb-3">
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
          </div> -->
      </div>
      <PlanetLoading></PlanetLoading>
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
          @click="generatePic(), generate2()"
          ><i class="el-icon-stars" style="font-size: 20px"></i
          ><span class="hidden-sm-and-down" style="margin-left: 10px">{{
            lang == "中" ? "再次开始艺术创作" : "Start making art again"
          }}</span>
        </el-button>
      </div>
      <div class="flex justify-center">
        <p
          v-if="!advancedSet2"
          class="mb-4 mt-4 text-center antialiased font-normal text-base leading-6 text-blue-500"
        >
          <span class="cursor-pointer" @click="advanceSet2()">{{
            lang == "中" ? "+ 个性化设置" : "+ Advanced Settings"
          }}</span>
        </p>
      </div>
      <div
        v-show="advancedSet2"
        class="flex flex-col md:flex-row md:justify-between mt-5 settings flex-wrap"
        :class="advanced2 == false ? 'off' : 'on'"
      >
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 100%"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div slot="content">
                {{
                  lang == "中"
                    ? "笔画数控制了作图的精细程度"
                    : "The number of strokes controls the fineness of the drawing"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "自定义笔画数" : "Number of strokes" }}
          </h3>
          <!-- <el-input-number
            v-model="NumberOfStrokes"
            :min="1"
            style="width: 55%"
          ></el-input-number> -->
          <el-slider
            class="hidden-sm-and-down"
            v-model="NumberOfStrokes"
            style="width: 85%"
            show-input
            :min="30"
            :max="200"
            :marks="marks1"
          ></el-slider>
          <el-slider
            class="w-89/100 hidden-sm-and-up"
            style="margin: 0 auto"
            v-model="NumberOfStrokes"
            :min="30"
            :max="200"
            :marks="marks1"
          >
          </el-slider>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 100%"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "为了提高体验，防止等待时间过长,迭代轮数默认为1000，最小为100，最大为2400"
                    : "In order to improve the experience and prevent the waiting time from being too long.The default number of iteration rounds is 1000, the minimum is 100, and the maximum is 2400"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{
              lang == "中" ? "自定义迭代轮数" : "Number of iteration rounds"
            }}
          </h3>
          <el-slider
            class="hidden-sm-and-down"
            :style="[{ width: lang == '中' ? '85%' : '80%' }]"
            v-model="NumOfIterations"
            show-input
            :min="100"
            :max="2400"
            :step="100"
            :marks="marks3"
          >
          </el-slider>
          <el-slider
            class="w-89/100 hidden-sm-and-up"
            style="margin: 0 auto"
            v-model="NumOfIterations"
            :min="100"
            :max="2400"
            :step="100"
            :marks="marks3"
          >
          </el-slider>
          <!-- <el-input
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
          </el-input> -->
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet special"
          style="width: 32%; padding-right: 0px; margin-top: 10px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "可以自定义生成图片的风格,默认为素描草图风格"
                    : "You can customize the style of generated pictures.The default is sketch style"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "自定义风格" : "Custom style" }}
          </h3>
          <el-select v-model="styleDiy" placeholder="请选择" style="width: 55%">
            <el-option
              v-for="item in styleList"
              :key="item.value"
              :label="lang == '中' ? item.label : item.label_en"
              :value="item.value"
              ><el-image
                class="option_img"
                :src="item.pic"
                :preview-src-list="item.srcList"
                fit="contain"
                style="float: left; width: 60px; height: 45px"
              ></el-image>
              <span style="float: right; font-size: 16px">{{
                lang == "中" ? item.label : item.label_en
              }}</span>
            </el-option></el-select
          >
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 32%; margin-top: 10px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "Clip损失强度默认为0.1，最小为0，最大为1.0"
                    : "Clip loss strength is 0.1 by default, the minimum is 0, and the maximum is 1.0"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "Clip损失强度" : "Clip Loss Strength" }}
          </h3>

          <el-input-number
            v-model="ClipLoss"
            :precision="1"
            :step="0.1"
            :min="0.0"
            :max="1.0"
            style="width: 55%"
          ></el-input-number>
        </div>
        <div
          class="flex flex-row justify-between items-center indeSet flex-wrap"
          style="width: 32%; margin-top: 10px"
        >
          <h3 class="tracking-wider">
            <el-tooltip effect="dark" placement="top-start">
              <div
                slot="content"
                style="
                  white-space: pre-wrap;
                  word-break: break-all;
                  width: 250px;
                "
              >
                {{
                  lang == "中"
                    ? "SDS损失强度默认为1.0，最小为0，最大为2"
                    : "The SDS loss strength defaults to 1.0, the minimum is 0, and the maximum is 2"
                }}
              </div>
              <i class="el-icon-info mr-1"></i> </el-tooltip
            >{{ lang == "中" ? "SDS损失强度" : "SDS Loss Strength" }}
          </h3>
          <el-input-number
            v-model="SDSLoss"
            :precision="1"
            :step="0.1"
            :min="0.0"
            :max="2.0"
            style="width: 55%"
          ></el-input-number>
          <!-- <el-input
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
          </el-input> -->
        </div>
      </div>
      <div class="flex justify-center">
        <p
          v-if="advancedSet2"
          class="mb-4 mt-4 text-center antialiased font-normal text-base duration-200 leading-6 text-gray-500"
        >
          <span class="cursor-pointer" @click="advanceSet2()">{{
            lang == "中" ? "- 个性化设置" : "- Hide Advanced Settings"
          }}</span>
        </p>
      </div>
      <div class="flex flex-row flex-wrap justify-around w-full">
        <div
          class="flex flex-col w-full md:w-1/3 imageContainer"
          v-for="item in resultList"
          :key="item.label"
        >
          <div style="margin: 0 auto; font-size: 21px; font-weight: 600">
            {{ lang == "中" ? item.txt : item.txt_en }}
          </div>
          <el-image
            :src="item.value"
            :preview-src-list="item.srcList"
            fit="cover"
            style="
              width: 100%;
              height: 78%;
              border: 2px solid rgba(0, 0, 0, 0.7);
            "
            class="result_img"
            lazy
            loop="true"
            autoplay="true"
          ></el-image
          ><el-image-viewer
            class="image_viewer"
            v-if="showViewer"
            :on-close="closeViewer"
            :url-list="srcList"
          ></el-image-viewer>
          <div class="flex mt-2 justify-between">
            <el-button type="success" style="width: 47%" @click="preview(item)"
              ><i class="el-icon-search mr-1"></i
              >{{ lang == "中" ? "放大预览" : "Preview" }}</el-button
            ><el-button
              type="primary"
              style="width: 47%"
              @click="click_down_excel(item.value, item.txt)"
            >
              <i class="el-icon-download mr-1"></i
              >{{ lang == "中" ? "下载图片" : "Download" }}</el-button
            >
          </div>
        </div>
      </div>
      <div class="w-full mt-2">
        <p class="tracking-wider text-2xl font-medium exampleText">
          {{
            lang == "中" ? "DiffSketch作品示例" : "Example of DiffSketch work"
          }}
        </p>
      </div>
      <div class="flex-col flex md:flex-row w-full justify-around flex-wrap">
        <div
          class="w-full h-full md:w-3/10 items-center leftdis flex flex-col justify-center"
          v-for="item in displayList.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )"
          :key="item.src"
        >
          <el-image
            :src="item.src"
            :preview-src-list="item.srcList"
            fit="cover"
            lazy
            style="
              border: 2px solid rgba(0, 0, 0, 0.7);
              width: 90%;
              margin-top: 1.2rem;
              margin-bottom: 1rem;
              height: 100%;
            "
          ></el-image>
          <!-- <el-carousel
            :autoplay="false"
            indicator-position="outside"
            style="width: 90%; margin-top: 1rem"
            @change="onChange"
          >
            <el-carousel-item v-for="item in displayList" :key="item.key">
              <el-image
                :src="item.src"
                style="width: 100%; height: 100%"
              ></el-image>
            </el-carousel-item>
          </el-carousel> -->

          <div
            class="font-medium tracking-wider"
            style="
              width: 90%;

              word-break: break-all;
              margin-bottom: 1.25rem;
            "
          >
            <p class="mb-1.5">
              <span class=" "
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "提示词:" : "Prompt:" }}&nbsp;</span
                >{{ item.text }}</span
              >
            </p>
            <p class="mb-1.5 flex justify-between">
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "风格:" : "Style:" }}&nbsp;</span
                >{{ lang == "中" ? item.StyleText : item.StyleText_en }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "笔画数:" : "StrokeNum:" }}&nbsp;</span
                >{{ item.NumberOfStrokes }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{
                    lang == "中" ? "控制点数:" : "ControlPoint:"
                  }}&nbsp;</span
                >{{ item.NumberOfControlPoints }}</span
              >
            </p>
            <p class="flex justify-between">
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "迭代数:" : "Iterations:" }}&nbsp;</span
                >{{ item.NumOfIterations }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "CLIP损失:" : "CLipLoss:" }}&nbsp;</span
                >{{ item.ClipLoss }}</span
              >
              <span class="text-sm"
                ><span class="text-blue-600"
                  >{{ lang == "中" ? "SDS损失:" : "SDSLoss:" }}&nbsp;</span
                >{{ item.SDSLoss }}</span
              >
            </p>
          </div>

          <!-- <div style="width: 90%" class="pb-3">
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
          </div> -->
        </div>
      </div>
      <el-pagination
        class="mt-2"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="this.displayList.length"
      />
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
  mounted() {
    window.addEventListener("setItem", this.printLog);
  },
  //页面销毁
  beforeDestroy() {
    window.removeEventListener("setItem", this.printLog);
  },
  data() {
    return {
      pre: "",
      cur: "",
      prompt: "",
      textarea: "",
      flag1: false,
      isProcessing: false,
      showResults: false,
      advanced: false,
      advanced2: true,
      NumberOfStrokes: 96,
      NumberOfControlPoints: 4,
      advancedSet: false,
      advancedSet2: true,
      showViewer: false, // 显示查看器
      curIndex: 0,
      isLiked: [false, false, false, false],
      styleDiy: "sketch",
      ClipLoss: 0.1,
      SDSLoss: 1.0,
      NumOfIterations: 1000,
      srcList: [],
      marks1: {
        30: "30",
        115: "115",
        200: "200",
      },
      marks2: {
        2: "2",
        5: "5",
        8: "8",
      },
      marks3: {
        100: "100",
        1200: "1200",
        2400: "2400",
      },
      styleList: [
        {
          value: "sketch",
          pic: require("../assets/sketch.png"),
          label: "素描草图",
          label_en: "sketch",
          srcList: [require("../assets/sketch.png")],
        },
        {
          value: "color",
          pic: require("../assets/color.png"),
          label: "色彩丰富",
          label_en: "colorful",
          srcList: [require("../assets/color.png")],
        },
        {
          value: "oil",
          pic: require("../assets/oil.png"),
          label: "油画绘制",
          label_en: "oil painting",
          srcList: [require("../assets/oil.png")],
        },
      ],
      resultList: [
        // {
        //   value: require("../assets/color.png"),
        //   label: "color",
        //   srcList: [require("../assets/color.png")],
        // },
        // {
        //   txt: "对照图片",
        //   value: require("../assets/oil.png"),
        //   label: "oil1",
        //   srcList: [require("../assets/oil.png")],
        // },
        // {
        //   txt: "对照图片",
        //   value: require("../assets/oil.png"),
        //   label: "oil2",
        //   srcList: [require("../assets/oil.png")],
        // },
        // {
        //   txt: "对照图片",
        //   value: require("../assets/1.gif"),
        //   label: "oil3",
        //   srcList: [require("../assets/oil.png")],
        // },
      ],
      displayList: [
        {
          src: require("../assets/SVG/horse-128.svg"),
          text: "A horse is drinking water by the lake",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [require("../assets/SVG/horse-128.svg")],
          NumberOfStrokes: 128,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/horse-96-1990-color.svg"),
          text: "A horse is drinking water by the lake",
          StyleText: "色彩丰富",
          StyleText_en: "colorful",
          srcList: [require("../assets/SVG/horse-96-1990-color.svg")],
          NumberOfStrokes: 128,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/ballon-128.svg"),
          text: "Colorful hot air balloons high over the mountains",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [require("../assets/SVG/ballon-128.svg")],
          NumberOfStrokes: 128,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/yoda128-1990.svg"),
          text: "Very detailed masterpiece painting of baby yoda holding a lightsaber",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [require("../assets/SVG/yoda128-1990.svg")],
          NumberOfStrokes: 96,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/p1000_portrait_1990_oil.svg"),
          text: "Portrait of Latin woman having a spiritual awakening,eyes closed, slight smile,illuminating lights,oil painting,by Van Gogh",
          StyleText: "油画风格",
          StyleText_en: "oil painting",
          srcList: [require("../assets/SVG/p1000_portrait_1990_oil.svg")],
          NumberOfStrokes: 96,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/fox32.svg"),
          text: "A fox is sitting on the sofa",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [require("../assets/SVG/fox32.svg")],
          NumberOfStrokes: 32,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/sydney.svg"),
          text: "Real photo of Sydney opera house",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [require("../assets/download.png")],
          NumberOfStrokes: 96,
          NumberOfControlPoints: 4,
          ClipLoss: 0.1,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/sydney_color_300_0.2.svg"),
          text: "Real photo of Sydney opera house",
          StyleText: "色彩丰富",
          StyleText_en: "colorful",
          srcList: [require("../assets/SVG/sydney_color_300_0.2.svg")],
          NumberOfStrokes: 96,
          NumberOfControlPoints: 4,
          ClipLoss: 0.2,
          SDSLoss: 1.0,
          NumOfIterations: 3000,
        },
        {
          src: require("../assets/SVG/cat128-1990.svg"),
          text: "A cute cat in the style of Pixar animations rides a bike",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [require("../assets/SVG/cat128-1990.svg")],
          NumberOfStrokes: 128,
          NumberOfControlPoints: 3,
          ClipLoss: 0.2,
          SDSLoss: 1.0,
          NumOfIterations: 2000,
        },
        {
          src: require("../assets/SVG/yoda96-190_Color.svg"),
          text: "Very detailed masterpiece painting of baby yoda holding a lightsaber",
          StyleText: "色彩丰富",
          StyleText_en: "colorful",
          srcList: [require("../assets/SVG/yoda96-190_Color.svg")],
          NumberOfStrokes: 96,
          NumberOfControlPoints: 3,
          ClipLoss: 0.2,
          SDSLoss: 1.0,
          NumOfIterations: 200,
        },
        {
          src: require("../assets/SVG/Very detailed masterpiece painting of baby yoda holding a lightsaber_96_1200_0.2_0.9.svg"),
          text: "Very detailed masterpiece painting of baby yoda holding a lightsaber",
          StyleText: "色彩丰富",
          StyleText_en: "colorful",
          srcList: [
            require("../assets/SVG/Very detailed masterpiece painting of baby yoda holding a lightsaber_96_1200_0.2_0.9.svg"),
          ],
          NumberOfStrokes: 96,
          NumberOfControlPoints: 4,
          ClipLoss: 0.2,
          SDSLoss: 0.9,
          NumOfIterations: 1200,
        },
        {
          src: require("../assets/SVG/A sketching with watercolors of a modern Athens neighborhood.svg"),
          text: "A sketching with watercolors of a modern Athens neighborhood",
          StyleText: "素描草图",
          StyleText_en: "sketch",
          srcList: [
            require("../assets/SVG/A sketching with watercolors of a modern Athens neighborhood.svg"),
          ],
          NumberOfStrokes: 120,
          NumberOfControlPoints: 4,
          ClipLoss: 0.2,
          SDSLoss: 1.2,
          NumOfIterations: 1200,
        },
      ],
      currentPage: 1,
      pageSize: 6,
      iteration: {
        src: null,
        srcList: null,
      },
      curIter: 0,
      totIter: 0,
      lang: sessionStorage.getItem("lang2"),
    };
  },
  methods: {
    printLog() {
      // console.log("监听到数据变化");
      this.lang = sessionStorage.getItem("lang2");
      console.log(this.lang);
    },
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
      if (!this.advancedSet) {
        this.advancedSet = !this.advancedSet;
      } else {
        setTimeout(() => {
          this.advancedSet = !this.advancedSet;
        }, 500);
      }
    },
    advanceSet2() {
      this.advanced2 = !this.advanced2;
      if (!this.advancedSet2) {
        this.advancedSet2 = !this.advancedSet2;
      } else {
        setTimeout(() => {
          this.advancedSet2 = !this.advancedSet2;
        }, 500);
      }
    },
    perFormat(value) {
      return `${value}%`;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      console.log(this.currentPage);
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
    generate2() {
      // 每5秒发送一次请求,如果返回的结果是图片，那么就停止
      let id;
      id = setInterval(() => {
        this.$axios({
          method: "get",
          url: " http://10.212.253.234:7075/api/draw2",
          params: {
            prompt: this.textarea,
            style: this.styleDiy,
            NumberOfStrokes: this.NumberOfStrokes,
            NumOfIterations: this.NumOfIterations,
            ClipLoss: this.ClipLoss,
            SDSLoss: this.SDSLoss,
          },
        })
          .then((res) => {
            console.log(res.data.msg);
            this.cur = res.data.msg;
            if (
              res.data.filename == "iter0.png" ||
              res.data.filename == "iter0.svg"
            ) {
              this.flag1 = true;
            }
            if (this.flag1) {
              console.log("第一次");
              if (res.data.msg == "") {
                console.log("跳过");
              } else {
                var firstNumberMatch = res.data.filename.match(/\d+/);
                this.curIter = String(parseInt(firstNumberMatch[0]) + 10);
                // this.iteration.src = "data:image/png;base64," + res.data.msg;
                // this.iteration.srcList = [
                //   "data:image/png;base64," + res.data.msg,
                // ];
                this.iteration.src =
                  "data:image/svg+xml;base64," + res.data.msg;
                this.iteration.srcList = [
                  "data:image/svg+xml;base64," + res.data.msg,
                ];
              }
            }
            if (res.data.msg == "finished" || this.showResults) {
              clearInterval(id);
            }
            // if (this.showResults || res.data.msg == "finished") {
            // if (this.cur == this.pre) {
            //   console.log("相同");
            // } else if (this.cur == "error") {
            // } else if (
            //   res.data.filename != "iter0.png" &&
            //   res.data.filename != "iter0.svg" &&
            //   this.pre == ""
            // ) {
            //   console.log(this.pre);
            //   console.log("不是第一次");
            // } else {
            //   console.log("不同");
            //   this.pre = this.cur;
            //   this.iteration.src = "data:image/png;base64," + res.data.msg;
            //   this.iteration.srcList = [
            //     "data:image/png;base64," + res.data.msg,
            //   ];
            // }
            // clearInterval(id);
            // this.pre = "";
            // }
            // console.log(res);
          })
          .catch((err) => {
            clearInterval(id);
            console.log(err);
          });
      }, 500);
    },
    generatePic() {
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
      var set = {
        textarea: this.textarea,
        NumberOfStrokes: this.NumberOfStrokes,
        NumOfIterations: this.NumOfIterations,
        styleDiy: this.styleDiy,
        ClipLoss: this.ClipLoss,
        SDSLoss: this.SDSLoss,
      };
      this.isProcessing = !this.isProcessing;
      if (this.showResults) {
        this.showResults = !this.showResults;
      }
      this.totIter = this.NumOfIterations;
      // 如果texrtarea内容是promptList中的几个，那么直接产生图片
      // if (promptList.indexOf(this.textarea) != -1) {
      //   console.log("直接生成图片");
      //   if (
      //     this.textarea ==
      //     "Macaw full color,ultra detailed,realistic,insanely beautiful"
      //   ) {
      //     this.resultList = [];
      //     // console.log(res.data.msg);
      //     this.resultList.push({
      //       // image2
      //       txt: "生成的位图",
      //       value: require("../assets/SVG/yoda96-190_Color.svg"),
      //       label: "color",
      //       srcList: [require("../assets/SVG/yoda96-190_Color.svg")],
      //     });
      //     this.resultList.push({
      //       txt: "生成的矢量图",
      //       value: require("../assets/SVG/yingwu.svg"),
      //       label: "sketch",
      //       srcList: ["../assets/SVG/yingwu.svg"],
      //     });
      //     this.resultList.push({
      //       txt: "生成过程",
      //       value: require("../assets/0.gif"),
      //       label: "sketch",
      //       srcList: [require("../assets/0.gif")],
      //     });
      //   }
      //   // 延时3秒
      //   setTimeout(() => {
      //     this.isProcessing = !this.isProcessing;
      //     this.showResults = !this.showResults;
      //   }, 3000);
      // } else {
      this.$axios({
        method: "get",
        url: " http://10.212.253.234:7075/api/draw",
        params: {
          prompt: this.textarea,
          style: this.styleDiy,
          NumberOfStrokes: this.NumberOfStrokes,
          NumOfIterations: this.NumOfIterations,
          ClipLoss: this.ClipLoss,
          SDSLoss: this.SDSLoss,
        },
      })
        .then((res) => {
          console.log(res);
          this.resultList = [];
          // 去掉msg开头和结尾的双引号
          res.data.msg = res.data.msg.replace(/^\"|\"$/g, "");
          res.data.msg2 = res.data.msg2.replace(/^\"|\"$/g, "");
          // console.log(res.data.msg);
          this.resultList.push({
            // image2
            txt: "生成的位图",
            txt_en: "Generated Bitmap",
            value: "data:image/png;base64," + res.data.msg2,
            label: "color",
            srcList: ["data:image/png;base64," + res.data.msg2],
          });
          this.resultList.push({
            txt: "生成的矢量图",
            txt_en: "Generated VectorPic",
            value: "data:image/svg+xml;base64," + res.data.msg,
            label: "sketch",
            srcList: ["data:image/svg+xml;base64," + res.data.msg],
          });
          this.resultList.push({
            txt: "生成过程",
            txt_en: "Generated Process",
            value: "data:image/gif;base64," + res.data.msg3,
            label: "sketch",
            srcList: ["data:image/gif;base64," + res.data.msg3],
          });
          this.isProcessing = !this.isProcessing;
          this.showResults = !this.showResults;
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      // }
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
    click_down_excel(url, name) {
      // console.log(url);
      const link = document.createElement("a");
      link.style.display = "none";
      // 将 base64 编码的图片数据设置为链接的 href 属性
      link.href = url;
      // 设置下载文件名
      if (name == "生成的位图") {
        link.download = name + ".png";
      } else if (name == "生成的矢量图") {
        link.download = name + ".svg";
      } // 这里可以自定义下载文件名
      else {
        link.download = name + ".gif"; // 这里可以自定义下载文件名
      }

      // 将链接添加到 DOM 中
      document.body.appendChild(link);

      // 模拟点击链接以触发下载
      link.click();

      // 移除链接元素
      document.body.removeChild(link);
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
    picTest() {
      // 发包
      this.$axios({
        method: "get",
        url: " http://10.212.253.234:7075/api/draw",
        params: {
          prompt:
            "A sketching with watercolors of a modern Athens neighborhood",
          style: this.styleDiy,
          NumberOfStrokes: this.NumberOfStrokes,
          flexibility: this.flexibility,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss">
.el-image-viewer__mask {
  opacity: 0.95;
  background: #fff;
}
.el-image-viewer__img {
  border: 2px solid rgba(0, 0, 0, 0.7);
}
</style>
<style lang="scss" scoped>
.form_container {
  margin: 8px auto 0 auto;
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
.form_container1 {
  margin: 15px auto 0 auto;
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
  width: 30%;
}
// .imageContainer:nth-child(odd) {
//   padding: 10px 15px 25px 80px;
// } //奇数行

// .imageContainer:nth-child(0) {
//   padding: 10px 80px 25px 15px;
// }
@keyframes unfold {
  from {
    height: 0px;
  }
  to {
    height: 240px;
  }
}

@keyframes shrink {
  from {
    height: 240px;
  }
  to {
    height: 0px;
  }
}
.on {
  height: 240px;
  animation: unfold 1.2s 1 ease-out;
}
.off {
  height: 0px;
  animation: shrink 1.2s 1 ease-out;
}
.indeSet {
  padding-right: 0px !important;
  margin-bottom: 12px !important;
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
    width: 100%;
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
    margin-top: 18px !important;
  }
  .special {
    width: 100% !important;
    padding-right: 0px !important;
    margin-top: 25px !important;
  }
  @keyframes unfold {
    from {
      height: 0px;
    }
    to {
      height: 415px;
    }
  }

  @keyframes shrink {
    from {
      height: 415px;
    }
    to {
      height: 0px;
    }
  }
  .on {
    height: 415px;
    animation: unfold 1.2s 1 ease-out;
  }
  .off {
    height: 0px;
    animation: shrink 1.2s 1 ease-out;
  }
  .leftdis {
    --tw-shadow: 0px 3.7112px 13.917px rgba(0, 0, 0, 0.25);
    --tw-shadow-colored: 0px 3.7112px 13.917px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border-radius: 10px;
    background: #fff;
    margin-bottom: 25px;
  }
  .leftdis1 {
    --tw-shadow: 0px 3.7112px 13.917px rgba(0, 0, 0, 0.25);
    --tw-shadow-colored: 0px 3.7112px 13.917px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    border-radius: 10px;
    background: #fff;
    margin-bottom: 25px;
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
  margin-top: 15px;
}
.leftdis1 {
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
.exampleText {
  // width: fit-content;
  // background-color: white; /* 白色背景 */
  // padding: 15px; /* 调整内边距以增加空间 */
  // box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  // border-radius: 5px; /* 圆角边框 */
}
::v-deep .el-select-dropdown__item li {
  background-color: transparent !important;
}
// prev和next箭头的样式
::v-deep .el-pagination .btn-next,
::v-deep .el-pagination .btn-prev {
  background: transparent !important;
  background-color: transparent !important;
}
// prev和next箭头disabled的样式
::v-deep .el-pagination button:disabled {
  background-color: transparent !important;
}
// 页码样式
::v-deep .el-pager li {
  background-color: transparent !important;
}
// active的页码样式
::v-deep .el-pager li.active {
  color: #267aff !important;
}
</style>
