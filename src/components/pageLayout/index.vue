<template>
  <div class="main-page" :style="style">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const height = ref<number>(0)

const { safeAreaInsets } = uni.getWindowInfo()

const props = defineProps({
  customNavbar: {
    type: Boolean,
    default: true
  },
  safeTop: Boolean,
  bgColor: String,
  navBarHeight: {
    type: Number,
    default: 44
  },
  hasScroll: Boolean,
  hasTabBar: Boolean,
  padding: String
})

try {
  let clip = 0
  if (props.customNavbar) {
    clip += props.navBarHeight || 0
  }
  if (props.hasTabBar) {
    clip += 50
  }
  height.value = clip
  if (props.customNavbar && props.navBarHeight) {
    height.value += safeAreaInsets!.top
  }
  if (safeAreaInsets?.bottom) {
    height.value += safeAreaInsets.bottom
  }
} catch (e) {
  console.log(e)
}

const style = computed(() => {
  return {
    height: `calc(100vh - ${height.value}px)`,
    overflowY: props.hasScroll ? 'auto' : 'hidden',
    backgroundColor: props.bgColor ? props.bgColor : '#f8f8fa',
    padding: props.padding || ''
  }
})

defineExpose({
  safeAreaInsets
})
</script>

<style scoped lang="scss">
.main-page {
  position: relative;
  width: 100%;
}
</style>
