<template>
  <view class="empty-container">
    <image
      class="empty-image"
      :src="imgSrc"
      :style="{ width: imgWidth, height: imgHeight }"
      mode="aspectFit"
    />

    <text class="empty-text" :style="{ color: textColor }">{{
      description
    }}</text>

    <view class="empty-slot" v-if="$slots.default">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

// 定义 Props 类型
interface Props {
  description?: string // 提示文字
  image?: string // 自定义图片路径
  width?: number | string // 图片宽度 (默认单位 rpx)
  height?: number | string // 图片高度 (默认单位 rpx)，不传则默认等于宽度
  textColor?: string // 文字颜色
  marginTop?: string // 距离顶部的距离
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  description: '暂无相关数据',
  // 这里放一张默认的空状态图，你可以替换成本地图片路径，例如 '/static/empty.png'
  image: 'https://cdn.uviewui.com/uview/empty/data.png',
  width: 320,
  textColor: '#909399',
  marginTop: '200rpx'
})

// 计算图片来源 (处理本地图片或网络图片)
const imgSrc = computed(() => props.image)

// 处理尺寸单位，如果是数字则加上 rpx
const formatSize = (size: number | string | undefined) => {
  if (!size) return '0rpx'
  return typeof size === 'number' ? `${size}rpx` : size
}

const imgWidth = computed(() => formatSize(props.width))
const imgHeight = computed(() =>
  props.height ? formatSize(props.height) : formatSize(props.width)
)
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .empty-image {
    margin-bottom: 10px;
    /* 防止图片被挤压 */
    flex-shrink: 0;
  }

  .empty-text {
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
  }

  .empty-slot {
    display: flex;
    justify-content: center;
  }
}
</style>
