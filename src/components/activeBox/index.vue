<template>
  <view
    class="active-box"
    :class="{ 'is-active': isActive }"
    @click="handleClick"
  >
    <view class="content">
      <slot>
        <text>{{ title }}</text>
      </slot>
    </view>

    <view v-if="isActive" class="icon-check"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义 Props 类型

const props = defineProps({
  title: {
    type: String,
    default: '点击激活'
  },
  defaultActive: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['change', 'update:defaultActive'])

// 内部状态
const isActive = ref<boolean>(props.defaultActive)

// 点击事件处理
const handleClick = () => {
  isActive.value = !isActive.value
  // 触发事件通知父组件
  emits('change', isActive.value)
}
</script>

<style lang="scss" scoped>
// 定义变量方便维护
$primary-color: #2979ff;
$text-color: #333;
$text-active: #fff;
$bg-inactive: #f5f5f5;
$bg-active: $primary-color;
$border-radius: 12rpx;

.active-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 20px;
  background-color: $bg-inactive;
  border: 1px solid transparent;
  border-radius: $border-radius;
  transition: all 0.3s ease; // 平滑过渡动画
  cursor: pointer;

  // 内部文字样式
  .content {
    font-size: 14px;
    color: $text-color;
    font-weight: 500;
  }

  // 激活状态样式
  &.is-active {
    background-color: $bg-active;
    box-shadow: 0 4rpx 12rpx rgba($primary-color, 0.3);
    transform: scale(1.02); // 微微放大效果

    .content {
      color: $text-active;
    }
  }

  // 右上角对勾图标样式
  .icon-check {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 10px;
    color: #fff;
    line-height: 1;
  }
}
</style>
