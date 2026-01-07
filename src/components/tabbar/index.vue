<template>
  <u-tabbar
    v-model="active"
    :list="tabList"
    :show="show"
    :bg-color="bgColor"
    :height="height"
    :icon-size="iconSize"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :mid-button="midButton"
    :border-top="borderTop"
    :hide-tab-bar="hideTabBar"
    :before-switch="beforeSwitch"
    @change="change"
  ></u-tabbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tab {
  iconPath?: string
  selectedIconPath?: string
  text?: string
  count?: number
  isDot?: boolean
  midButton?: boolean
  customIcon?: boolean
}
interface Props {
  tabList: Tab[]
  show?: boolean
  bgColor?: string
  height?: string | number
  iconSize?: string | number
  midButtonSize?: string | number
  activeColor?: string
  inactiveColor?: string
  modelValue: number
  midButton?: boolean
  borderTop?: boolean
  hideTabBar?: boolean
  beforeSwitch?: () => void
  change?: (index: number) => void
}
const props = withDefaults(defineProps<Props>(), {
  tabList: () => [],
  show: true,
  bgColor: '#ffffff',
  height: '55px',
  iconSize: 40,
  midButtonSize: 90,
  activeColor: '#303133',
  inactiveColor: '#606266',
  midButton: false,
  borderTop: true,
  hideTabBar: false,
  modelValue: 0
})

const emit = defineEmits(['update:modelValue'])

const active = computed({
  get() {
    return props.modelValue
  },
  set(val: any) {
    emit('update:modelValue', val)
  }
})
</script>

<style scoped></style>
