<template>
  <div>
    <div class="load_4">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div>您的图片正在火速赶来</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.load_4 {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.load_4 div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #004cff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.load_4 div:nth-child(1) {
  left: 6px;
  animation: load_41 0.6s infinite;
}
.load_4 div:nth-child(2) {
  left: 6px;
  animation: load_42 0.6s infinite;
}
.load_4 div:nth-child(3) {
  left: 26px;
  animation: load_42 0.6s infinite;
}
.load_4 div:nth-child(4) {
  left: 45px;
  animation: load_43 0.6s infinite;
}
@keyframes load_41 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes load_43 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes load_42 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
</style>
