<script setup lang="ts">
import PageLayout from '@components/pageLayout/index.vue'
import { onMounted, ref } from 'vue'
import logo from '@/static/logo.jpeg'

// --- 类型定义 ---
interface MenuItem {
  title: string
  key: string
  desc?: string // 右侧描述文字（可选）
  path?: string // 跳转路径（可选）
}

// --- 状态数据 ---
const appVersion = ref('')

const menuList = ref<MenuItem[]>([
  { title: '检查更新', key: 'update', desc: '已是最新版' },
  { title: '联系我们', key: 'contact', desc: '' }
])

// --- 事件处理 ---
const handleMenuClick = (item: MenuItem) => {
  console.log('点击了:', item.title)

  switch (item.key) {
    case 'update':
      uni.showLoading({ title: '检查中...' })
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({ title: '当前已是最新版本', icon: 'none' })
      }, 1000)
      break
    case 'contact':
      uni.makePhoneCall({ phoneNumber: '4008888888' })
      break
    default:
      uni.showToast({ title: '暂未开放', icon: 'none' })
  }
}

onMounted(() => {
  const accountInfo = uni.getAccountInfoSync()

  // 获取版本号
  appVersion.value = accountInfo.miniProgram.version
})
</script>

<template>
  <u-navbar back-icon-size="26" back-text="" title="关于我们"> </u-navbar>

  <PageLayout>
    <view class="about-container">
      <view class="header-section">
        <view class="logo-box">
          <image class="logo-img" :src="logo" mode="aspectFit" />
        </view>
        <text class="app-name">博瑞五星鞋材</text>
        <view class="version-tag">
          <text>版本： {{ appVersion }}</text>
        </view>
      </view>

      <view class="menu-card">
        <view
          class="menu-item"
          v-for="(item, index) in menuList"
          :key="index"
          @click="handleMenuClick(item)"
        >
          <view class="item-left">
            <text class="item-title">{{ item.title }}</text>
          </view>
          <view class="item-right">
            <text class="item-desc" v-if="item.desc">{{ item.desc }}</text>
            <text class="arrow-icon">›</text>
          </view>
        </view>
      </view>

      <view class="footer-section">
        <text class="copyright">Copyright © 2026 Your Company Name</text>
        <text class="sub-text">All Rights Reserved</text>
      </view>
    </view></PageLayout
  >
</template>

<style scoped lang="scss">
// 变量定义
$primary-color: #2979ff; // 你喜欢的主题蓝
$bg-color: #f5f7fa;
$card-bg: #ffffff;
$text-main: #303133;
$text-sub: #909399;
$border-color: #ebeef5;

.about-container {
  height: 100%;
  background-color: $bg-color;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 头部样式
.header-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 30px;

  .logo-box {
    width: 80px;
    height: 80px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;

    .logo-img {
      width: 50px;
      height: 50px;
    }
  }

  .app-name {
    font-size: 18px;
    font-weight: 600;
    color: $text-main;
    margin-bottom: 8px;
  }

  .version-tag {
    background: rgba($primary-color, 0.1);
    padding: 3px 10px;
    border-radius: 50px;

    text {
      font-size: 12px;
      color: $primary-color;
      font-weight: 500;
    }
  }
}

// 菜单列表样式
.menu-card {
  width: 100%;
  background-color: $card-bg;
  border-radius: 12px;
  overflow: hidden; // 确保子元素圆角不溢出
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  margin-bottom: auto; // 将底部版权挤下去

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1rpx solid $border-color;
    transition: background-color 0.2s;

    &:active {
      background-color: #f9f9f9;
    }

    &:last-child {
      border-bottom: none;
    }

    .item-left {
      display: flex;
      align-items: center;

      .item-title {
        font-size: 15px;
        color: $text-main;
      }
    }

    .item-right {
      display: flex;
      align-items: center;

      .item-desc {
        font-size: 13px;
        color: $text-sub;
        margin-right: 6px;
      }

      .arrow-icon {
        font-size: 16px;
        color: #c0c4cc;
        line-height: 1;
        margin-top: -4rpx; // 微调垂直对齐
      }
    }
  }
}

// 底部版权样式
.footer-section {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  .copyright,
  .sub-text {
    font-size: 11px;
    color: #c0c4cc;
    line-height: 1.6;
  }
}
</style>
