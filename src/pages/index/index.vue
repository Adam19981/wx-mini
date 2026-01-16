<template>
  <PageLayout :custom-navbar="false" :nav-bar-height="0" hasTabBar>
    <view class="page-container" :style="{ paddingTop: `${paddingTop}px` }">
      <view class="header-section">
        <view class="header-title">
          <text class="title-main">博瑞五星鞋材</text>
        </view>

        <view class="search-box" v-if="tabActive === 0">
          <u-icon name="search"></u-icon>
          <input
            class="search-input"
            type="text"
            v-model="searchParams.searchKeyword"
            placeholder="搜索型号..."
            placeholder-style="color: #999; font-size: 14px;"
            @confirm="handleSearch"
          />
          <view class="search-btn" @click="handleSearch">Go</view>
        </view>

        <view class="search-tag" v-if="tabActive === 0">
          <ActiveBox
            title="热门"
            :default-active="searchParams.is_hot"
            @change="handleSearchTag('is_hot', $event)"
          ></ActiveBox>

          <ActiveBox
            title="预售"
            :default-active="searchParams.is_presale"
            @change="handleSearchTag('is_presale', $event)"
          ></ActiveBox>
        </view>
      </view>

      <Mine v-if="tabActive === 1"></Mine>

      <scroll-view
        style="height: calc(100% - 140px)"
        class="content-section"
        scroll-y
        refresher-enabled
        :refresher-triggered="triggered"
        :lower-threshold="20"
        @refresherrefresh="refresh"
        @scrolltolower="scrolltolower"
        v-else
      >
        <view class="card-list">
          <ShoeCard
            v-for="item in productList"
            :key="item.shoe_id"
            :item="item"
            @change="handleCardClick"
          ></ShoeCard>
        </view>
      </scroll-view>
    </view>
  </PageLayout>

  <TabBar v-model="tabActive" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import PageLayout from '@/components/pageLayout/index.vue'
import TabBar from '@/components/customTabbar/index.vue'
import Mine from './mine.vue'
import { searchShoesPage } from '@/api/modules/shoe/shoeInterface'
import { Shoe } from '@/api/modules/shoe/proto/api'
import { manager as requestManager } from '@/request/manager'
import ShoeCard from '@/components/shoeCard/index.vue'
import ActiveBox from '@/components/activeBox/index.vue'

const paddingTop = ref(25)

const tabActive = ref(0)

const hasMore = ref(false)

const searchParams = reactive({
  searchKeyword: '',
  is_hot: true,
  is_presale: false,
  page_num: 1,
  page_size: 10
})

const triggered = ref(false)

const productList = ref<Shoe[]>([])

async function loadData() {
  const resp = await searchShoesPage({
    shape_code: searchParams.searchKeyword,
    material: '',
    shoe_size: '',
    is_hot: searchParams.is_hot ? 1 : 2,
    is_presale: searchParams.is_presale ? 1 : 2,
    by_favour: false,
    page_num: searchParams.page_num,
    page_size: searchParams.page_size
  })

  productList.value = productList.value.concat(resp?.list || [])

  hasMore.value = resp.total > productList.value.length
}

// 4. 方法
const handleSearch = async () => {
  searchParams.page_num = 1
  productList.value = []
  await loadData()
  uni.showToast({ title: '搜索已更新', icon: 'none' })
}

async function refresh() {
  triggered.value = true
  searchParams.page_num = 1
  productList.value = []
  await loadData()
  triggered.value = false
}

function scrolltolower() {
  if (!hasMore.value) return
  searchParams.page_num++
  loadData()
}

function handleSearchTag(type: 'is_hot' | 'is_presale', ev: boolean) {
  searchParams[type] = ev
  searchParams.page_num = 1
  productList.value = []
  loadData()
}

const handleCardClick = (item: Shoe) => {
  // 这里可以跳转详情页
  uni.navigateTo({ url: `/pages/detail/index?id=${item.shoe_id}` })
}

onReady(async () => {
  const { safeAreaInsets } = uni.getWindowInfo()

  paddingTop.value = safeAreaInsets.top || 25

  const token = await requestManager.token()

  if (token) {
    loadData()
  }
})
</script>

<style scoped lang="scss">
/* 定义变量，方便调整主题 */
$primary-color: #2c3e50;
$bg-color: #f5f7fa;
$text-main: #1a1a1a;
$text-sub: #8c8c8c;

.page-container {
  height: 100%;
  background-color: $bg-color;
  /* 使得整个页面字体平滑 */
  -webkit-font-smoothing: antialiased;
}

/* --- 头部设计 --- */
.header-section {
  width: 100%;
  padding: 0 16px 0 16px;
  background: rgba(245, 247, 250, 0.85); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 磨砂玻璃效果 */
  box-sizing: border-box;

  .header-title {
    .title-main {
      display: block;
      font-size: 32px;
      font-weight: 900;
      line-height: 1.2;
      color: transparent;
      /* 可选：加一点微弱的字母间距 */
      letter-spacing: 1px;
      background-image: linear-gradient(to right, #929292 0%, #000000 100%);
      -webkit-background-clip: text;
      transform: skewX(-10deg);
    }

    .title-sub {
      font-size: 16px;
      color: $text-sub;
      font-weight: 400;
      letter-spacing: 1px;
    }
  }
}

/* 搜索框样式 - 拟态/悬浮感 */
.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  height: 40px;
  border-radius: 25px; /* 完全圆角 */
  padding: 0 6px 0 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* 轻微阴影 */
  border: 1px solid rgba(0, 0, 0, 0.02);
  gap: 8px;
  margin: 16px 0 12px;

  .search-icon {
    font-size: 18px;
    margin-right: 10px;
    opacity: 0.5;
  }

  .search-input {
    flex: 1;
    font-size: 15px;
    color: $text-main;
    height: 100%;
  }

  .search-btn {
    width: 60px;
    height: 38px;
    background: $text-main;
    color: #fff;
    border-radius: 19px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    transition: transform 0.2s;

    &:active {
      transform: scale(0.95);
    }
  }
}

.search-tag {
  display: flex;
  gap: 12px;
}

/* 占位符高度 = padding top + title height + search height + margins */
/* 估算大约 160px，根据实际情况微调 */

/* --- 列表设计 --- */

.card-list {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  gap: 15px;
}
</style>
