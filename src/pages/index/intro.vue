<template>
  <view class="intro-container">
    <view class="diffuse-bg">
      <view class="blob blob-1"></view>
      <view class="blob blob-2"></view>
      <view class="blob blob-3"></view>
      <view class="noise-overlay"></view>
    </view>

    <view class="content-layer">
      <view class="brand-section">
        <view class="logo-circle">
          <text class="logo-text">BR</text>
        </view>
        <view class="title-group">
          <text class="main-title">公司简介</text>
        </view>
      </view>

      <view class="intro-section">
        <view class="intro-pair">
          <text class="intro-text">浙江台州博瑞鞋材（原五星），多年深耕鞋材制造，主营EVA3D、二次模内压、橡胶童底、TPR/TPE系列产品。</text>
          <text class="intro-text-en">Zhejiang Taizhou Borui Footwear Materials (formerly Wuxing) has dedicated years to footwear manufacturing, specializing in EVA 3D, secondary in-mold compression, rubber children's outsoles, and TPR/TPE series.</text>
        </view>
        <view class="intro-pair">
          <text class="intro-text">拥有8000平标准化生产厂区，源头工厂直供，品质稳定高性价比。</text>
          <text class="intro-text-en">Boasting an 8,000m² standardized production plant, we provide direct factory supply with stable quality and high cost-effectiveness.</text>
        </view>
        <view class="intro-pair">
          <text class="intro-text">携手百家合作伙伴，广受业界信赖好评。</text>
          <text class="intro-text-en">Partnering with hundreds of enterprises, Borui is widely recognized and trusted across the industry.</text>
        </view>
      </view>

      <view class="action-area">
        <button
          class="enter-btn-black"
          hover-class="btn-pressed"
          @click="handleEnterHome"
        >
          进入首页
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleEnterHome = () => {
  uni.reLaunch({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss" scoped>
/* 变量定义：保持与登录页一致 */
$bg-base: #ffffff;
$text-main: #1d1d1f;
$text-light: #86868b;
$btn-color: #000000;

.intro-container {
  width: 100vw;
  height: 100vh;
  background-color: $bg-base;
  position: relative;
  overflow: hidden;
}

/* 复用登录页的漫射背景动画 */
.diffuse-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #f5f5f7;

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.6;
    animation: drift 15s infinite alternate ease-in-out;
  }

  .blob-1 {
    width: 350px;
    height: 350px;
    background: #e0c3fc;
    top: -10%;
    right: -10%;
  }

  .blob-2 {
    width: 300px;
    height: 300px;
    background: #8ec5fc;
    bottom: 10%;
    left: -10%;
    animation-delay: -5s;
  }

  .blob-3 {
    width: 250px;
    height: 250px;
    background: #fad0c4;
    top: 40%;
    left: 40%;
    animation-delay: -8s;
  }

  .noise-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
    pointer-events: none;
  }
}

@keyframes drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(20px, 40px) scale(1.1); }
}

.content-layer {
  position: relative;
  z-index: 10;
  height: 100%;
  padding: 80px 30px 60px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.brand-section {
  margin-bottom: 40px;
  .logo-circle {
    width: 60px;
    height: 60px;
    background: $btn-color;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    .logo-text {
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      font-family: serif;
    }
  }
  .title-group {
    .main-title {
      font-size: 32px;
      font-weight: 800;
      color: $text-main;
      letter-spacing: -1px;
    }
  }
}

.intro-section {
  flex: 1;
  display: flex;
  flex-direction: column;

  .intro-pair {
    margin-bottom: 24px;

    .intro-text {
      font-size: 16px;
      line-height: 1.5;
      color: $text-main;
      text-align: justify;
      font-weight: 500;
      display: block;
      margin-bottom: 4px;
    }

    .intro-text-en {
      font-size: 13px;
      line-height: 1.4;
      color: $text-light;
      text-align: justify;
      font-weight: 400;
      display: block;
    }
  }
}

.action-area {
  margin-top: 40px;
}

.enter-btn-black {
  width: 100%;
  height: 60px;
  background: $btn-color;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;

  &::after { border: none; }

  &.btn-pressed {
    transform: scale(0.98);
    opacity: 0.9;
  }
}
</style>
