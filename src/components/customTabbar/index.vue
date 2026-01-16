<template>
  <view class="tab-bar-container">
    <view class="floating-island">
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ 'is-active': modelValue === index }"
        @click="switchTab(index)"
      >
        <view class="icon-box">
          <image
            class="icon-box-image"
            v-if="modelValue === index"
            :src="item.selectedIcon"
          ></image>
          <image
            class="icon-box-image"
            v-if="modelValue !== index"
            :src="item.icon"
          ></image>
        </view>
        <text class="label">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import productIcon from '@/static/tab/product.png'
import productActiveIcon from '@/static/tab/productActive.png'
import userIcon from '@/static/tab/user.png'
import userActiveIcon from '@/static/tab/userActive.png'

interface TabItem {
  text: string
  icon: string
  selectedIcon: string
}

// 定义 Props
defineProps<{
  modelValue: number // 当前选中的索引
}>()

// 定义 Emits
const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
}>()

// Tab 配置
const tabs: TabItem[] = [
  { text: '总览', icon: productIcon, selectedIcon: productActiveIcon }, // 产品总览
  { text: '我的', icon: userIcon, selectedIcon: userActiveIcon } // 个人中心
]

const switchTab = (index: number) => {
  // 触发震动反馈，增加交互质感
  uni.vibrateShort({ success: () => {} })
  emit('update:modelValue', index)
}
</script>

<style lang="scss" scoped>
$dark-bg: #1a1a1a;
$active-color: #fff;
$inactive-color: #666;

.tab-bar-container {
  position: fixed;
  bottom: 30px; /* 距离底部悬浮 */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 999;
  pointer-events: none; /* 让容器不阻挡两侧点击，只有内容区可点 */
}

.floating-island {
  pointer-events: auto;
  background: $dark-bg;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  width: 240px; /* 较短的宽度，显得精致 */
  height: 60px;
  border-radius: 30px; /* 胶囊形状 */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  /* 磨砂效果 (可选，视背景而定) */
  backdrop-filter: blur(10px);
}

.tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .icon-box-image {
    width: 26px;
    height: 26px;
  }

  .label {
    font-size: 10px;
    color: $inactive-color;
    font-weight: 500;
    transition: all 0.3s;
  }

  /* 激活状态样式 */
  &.is-active {
    transform: translateY(-2px); /* 微微上浮 */

    .icon {
      filter: grayscale(0%);
      opacity: 1;
      transform: scale(1.1);
    }

    .label {
      color: $active-color;
    }
  }
}

/* 激活指示光点 */
.active-dot {
  position: absolute;
  bottom: 6px;
  width: 4px;
  height: 4px;
  background-color: #5d5fef; /* 呼应首页的主题色 */
  border-radius: 50%;
  box-shadow: 0 0 6px #5d5fef;
}
</style>
