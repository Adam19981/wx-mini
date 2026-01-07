<template>
  <PageLayout :custom-navbar="false" :nav-bar-height="0" hasTabBar>
  </PageLayout>

  <TabBar
    :model-value="0"
    :tab-list="tabBarList"
    :active-color="'#1296db'"
    :change="handleChange"
  />
</template>

<script setup lang="ts">
import PageLayout from '@/components/pageLayout/index.vue'
import TabBar from '@/components/tabbar/index.vue'
import productIcon from '@/static/tab/product.png'
import productActiveIcon from '@/static/tab/productActive.png'
import userIcon from '@/static/tab/user.png'
import userActiveIcon from '@/static/tab/userActive.png'

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

function handleChange(ev: number) {
  if (ev) {
    uni.switchTab({
      url: '/pages/index/mine'
    })
  }
}
</script>

<style scoped lang="scss"></style>
