<script setup lang="ts">
import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import collectIcon from '@/static/mine/collect.png'
import aboutIcon from '@/static/mine/about.png'
import logoutIcon from '@/static/mine/logout.png'
import { hasAuthorization } from '@/utils'

import { manager as requestManager } from '@/request/manager'

const paddingTop = ref(0)

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '是否退出登录',
    async success(res) {
      if (res.confirm) {
        await requestManager.clear()
        uni.reLaunch({
          url: '/pages/index/login'
        })
      }
    }
  })
}

async function handleCheckFavour() {
  await hasAuthorization()
  uni.navigateTo({
    url: '/pages/index/favour'
  })
}

async function handleCheckAboutUs() {
  await hasAuthorization()
  uni.navigateTo({
    url: '/pages/index/aboutUs'
  })
}

onReady(() => {
  const { safeAreaInsets } = uni.getWindowInfo()
  paddingTop.value = safeAreaInsets.top || 25
})
</script>

<template>
  <div class="function-list">
    <div class="function-list-header">常用功能</div>

    <div
      class="function-list-item flx-justify-between"
      @click="handleCheckFavour"
    >
      <div class="flx-align-center">
        <image class="function-list-item-icon" :src="collectIcon"></image>
        <div>收藏栏</div>
      </div>
      <ide-icon name="arrow-right" :size="30"></ide-icon>
    </div>

    <div
      class="function-list-item flx-justify-between"
      @click="handleCheckAboutUs"
    >
      <div class="flx-align-center">
        <image class="function-list-item-icon" :src="aboutIcon"></image>
        <div>关于我们</div>
      </div>
    </div>

    <div class="function-list-item flx-justify-between" @click="handleLogout">
      <div class="flx-align-center">
        <image class="function-list-item-icon" :src="logoutIcon"></image>
        <div>退出登录</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  color: #000;
  font-size: 20px;
  font-weight: 700;
  width: 100%;
  height: max-content;
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(239, 244, 252, 1) 0%,
    rgba(79, 132, 216, 1) 100%
  );

  &-userInfo {
    column-gap: 16px;

    &-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.4);

      &-image {
        width: 30px;
        height: 30px;
      }
    }

    &-nickName {
      font-size: 16px;
      margin-bottom: 6px;
    }

    &-phone {
      font-size: 14px;
      color: #fff;
    }

    &-login {
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 14px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(80, 133, 217, 1) 99%
      );
    }
  }
}

.function-list {
  padding: 20px 18px;

  &-header {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 16px;
  }

  &-item {
    border-radius: 8px;
    margin-bottom: 16px;
    font-weight: 500;
    padding: 16px 12px;
    background: #fff;
    &-icon {
      width: 20px;
      height: 20px;
      margin-right: 12px;
      object-fit: contain;
    }
  }

  &-item:last-child {
    margin-bottom: 0;
  }
}
</style>
