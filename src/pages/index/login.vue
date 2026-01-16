<template>
  <view class="login-container">
    <view class="diffuse-bg">
      <view class="blob blob-1"></view>
      <view class="blob blob-2"></view>
      <view class="blob blob-3"></view>
      <view class="noise-overlay"></view>
    </view>

    <view class="content-layer">
      <view class="brand-section">
        <view class="logo-circle">
          <!--          <image class="logo-circle-image" :src="logo"></image>-->
          <text class="logo-text">WX.</text>
        </view>
        <view class="title-group">
          <text class="main-title">您好,</text>
          <text class="sub-title">欢迎使用博瑞五星鞋材</text>
        </view>
      </view>

      <view class="action-area">
        <button
          class="login-btn-black"
          hover-class="btn-pressed"
          @click="handleLogin"
          :loading="isLoading"
        >
          用户登录
          <!--          <text class="btn-text"></text>-->
        </button>

        <!--        <view class="footer-links">-->
        <!--          <text>Privacy Policy</text>-->
        <!--          <text class="dot">•</text>-->
        <!--          <text>Terms</text>-->
        <!--        </view>-->
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  loginIn,
  userInfo,
  userRoles
} from '@/api/modules/login/loginInterface'
// import logo from '@/static/logo.jpeg'
import { manager as requestManager } from '@/request/manager'

const isLoading = ref(false)

const handleLogin = () => {
  uni.vibrateShort({ success: () => {} })
  isLoading.value = true

  uni.login({
    provider: 'weixin',
    async success(res) {
      const resp = await loginIn({
        login_in_type: 4,
        account: '',
        phone: '',
        password: '',
        verify_code: '',
        email: '',
        code: res.code
      })

      await requestManager.setToken(resp.access_token)

      const respRole = await userRoles()

      console.log('role', respRole)

      if (respRole.roles?.length) {
        await requestManager.setRole(respRole.roles[0].id)
      }
      const respUser = await userInfo()

      console.log('user', respUser)

      if (respUser?.account) {
        await requestManager.setHeader('user', JSON.stringify(respUser))
      }

      isLoading.value = false

      uni.navigateTo({
        url: '/pages/index/index'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
/* 变量定义：浅色主题 */
$bg-base: #ffffff;
$text-main: #1d1d1f; /* 深灰/黑，接近 Apple 字体色 */
$text-light: #86868b;
$btn-color: #000000;

.login-container {
  width: 100vw;
  height: 100vh;
  background-color: $bg-base;
  position: relative;
  overflow: hidden;
}

/* --- 1. 漫射背景动画 --- */
.diffuse-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #f5f5f7; /* 浅灰底 */

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px); /* 极强的模糊 */
    opacity: 0.6;
    animation: drift 15s infinite alternate ease-in-out;
  }

  /* 配色：清新通透 */
  .blob-1 {
    width: 350px;
    height: 350px;
    background: #e0c3fc; /* 淡紫 */
    top: -10%;
    right: -10%;
  }

  .blob-2 {
    width: 300px;
    height: 300px;
    background: #8ec5fc; /* 冰蓝 */
    bottom: 10%;
    left: -10%;
    animation-delay: -5s;
  }

  .blob-3 {
    width: 250px;
    height: 250px;
    background: #fad0c4; /* 蜜桃粉 */
    top: 40%;
    left: 40%;
    animation-delay: -8s;
  }

  /* 噪点纹理，增加高级质感 (可选) */
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
  0% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(20px, 40px) scale(1.1);
  }
}

/* --- 2. 内容布局 --- */
.content-layer {
  position: relative;
  z-index: 10;
  height: 100%;
  padding: 100px 30px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.brand-section {
  .logo-circle {
    width: 60px;
    height: 60px;
    background: $btn-color;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 25px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);

    &-image {
      //width: 100%;
      //height: 100%;
    }

    .logo-text {
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      font-family: serif; /* 衬线体更有时尚感 */
    }
  }

  .title-group {
    .main-title {
      display: block;
      font-size: 48px;
      font-weight: 800;
      color: $text-main;
      letter-spacing: -1px; /* 紧凑字间距 */
      line-height: 1;
      margin-bottom: 10px;
    }

    .sub-title {
      font-size: 18px;
      color: $text-light;
      font-weight: 400;
    }
  }
}

.action-area {
  display: flex;
  flex-direction: column;
}

/* 纯黑按钮设计 */
.login-btn-black {
  width: 100%;
  height: 64px;
  background: $btn-color;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  //justify-content: space-between; /* 文字靠左，图标靠右 */
  padding: 0 30px;
  box-sizing: border-box;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2); /* 强烈的投影，制造悬浮感 */
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  color: #fff;
  text-align: center;

  &::after {
    border: none;
  }

  &.btn-pressed {
    transform: scale(0.97);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }

  .btn-text {
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .icon-arrow {
    width: 32px;
    height: 32px;
    background: #fff;
    border-radius: 50%;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
  }
}

.footer-links {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #b0b0b5;

  .dot {
    margin: 0 8px;
  }
}
</style>
