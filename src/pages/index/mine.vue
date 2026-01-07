<script setup lang="ts">
import TabBar from '@components/tabbar/index.vue'
import { ref, reactive } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import PageLayout from '@/components/pageLayout/index.vue'
import productIcon from '@/static/tab/product.png'
import productActiveIcon from '@/static/tab/productActive.png'
import userIcon from '@/static/tab/user.png'
import userActiveIcon from '@/static/tab/userActive.png'
import collectIcon from '@/static/mine/collect.png'
import aboutIcon from '@/static/mine/about.png'
import phoneIcon from '@/static/mine/phone.png'

const tabBarList = [
  {
    iconPath: productIcon,
    selectedIconPath: productActiveIcon,
    text: '产品总览'
  },
  {
    iconPath: userIcon,
    selectedIconPath: userActiveIcon,
    text: '我的'
  }
]

const userInfo = reactive({ id: '', name: '', phone: '' })

const paddingTop = ref(0)

function handleChange(ev: number) {
  if (!ev) {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
}

function toLogin() {}

onReady(() => {
  const { safeAreaInsets } = uni.getWindowInfo()
  paddingTop.value = safeAreaInsets.top || 25

  const { miniProgram } = uni.getAccountInfoSync()
})
</script>

<template>
  <PageLayout
    ref="pageLayoutEl"
    :custom-navbar="false"
    :nav-bar-height="0"
    hasTabBar
  >
    <div
      class="header"
      :style="{
        padding: `${paddingTop}px 16px 34px`
      }"
    >
      <div style="margin-bottom: 16px">五星</div>

      <div class="header-userInfo flx-align-center">
        <div class="header-userInfo-icon flx-center">
          <image
            class="header-userInfo-icon-image"
            :src="userActiveIcon"
          ></image>
        </div>

        <div>
          <div class="header-userInfo-nickName">{{ userInfo.name }}</div>
          <div class="header-userInfo-phone">
            联系方式：{{ userInfo.phone }}
          </div>
        </div>

        <!--        <div class="header-userInfo-login" @click="toLogin">登录</div>-->
      </div>
    </div>

    <div class="function-list">
      <div class="function-list-header">常用功能</div>

      <div class="function-list-item flx-justify-between">
        <div class="flx-align-center">
          <image class="function-list-item-icon" :src="collectIcon"></image>
          <div>收藏栏</div>
        </div>
        <ide-icon name="arrow-right" :size="30"></ide-icon>
      </div>

      <div class="function-list-item flx-justify-between">
        <div class="flx-align-center">
          <image class="function-list-item-icon" :src="aboutIcon"></image>
          <div>关于我们</div>
        </div>
      </div>

      <div class="function-list-item flx-justify-between">
        <div class="flx-align-center">
          <image class="function-list-item-icon" :src="phoneIcon"></image>
          <div>联系我们</div>
        </div>
      </div>
    </div>
  </PageLayout>

  <TabBar
    :model-value="1"
    :tab-list="tabBarList"
    :active-color="'#1296db'"
    :change="handleChange"
  />
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
