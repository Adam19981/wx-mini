<template>
  <PageLayout :custom-navbar="false" :nav-bar-height="0" hasTabBar>
    <view class="page-container" :style="{ paddingTop: `${paddingTop}px` }">
      <view class="header-section">
        <view class="header-title">
          <text class="title-main">博瑞五星鞋材</text>
        </view>

        <view class="search-wrapper" v-if="tabActive === 0">
          <view class="search-box" v-show="!showFilter">
            <u-icon name="search" size="28" color="#999"></u-icon>
            <div
              class="search-input"
              type="text"
              style="color: #999; font-size: 14px"
              @click="handleClickSearch"
            >
              {{ searchParams.shoe_size || '搜索型号...' }}
            </div>
            <view class="search-btn" @click="handleClickSearch">Go</view>
          </view>

          <view class="filter-dropdown" v-show="showFilter">
            <view class="filter-dropdown-title">高级筛选</view>

            <view class="search-box gary-box">
              <u-icon name="search" size="28" color="#999"></u-icon>
              <input
                class="search-input"
                type="text"
                :focus="focusActive"
                v-model="searchParams.shoe_size"
                @blur="focusActive = false"
                placeholder="搜索码数..."
                placeholder-style="color: #999; font-size: 14px;"
              />
            </view>

            <div class="grid-2">
              <view class="search-box gary-box">
                <u-icon name="arrow-down-fill" size="28" color="#999"></u-icon>

                <input
                  class="search-input"
                  type="text"
                  readonly
                  disabled
                  v-model="searchParams.material"
                  placeholder="选择材质"
                  @click="handleOpenSelect('material')"
                  placeholder-style="color: #999; font-size: 14px;"
                />
              </view>

              <view class="search-box gary-box">
                <u-icon name="arrow-down-fill" size="28" color="#999"></u-icon>

                <input
                  class="search-input"
                  type="text"
                  readonly
                  disabled
                  v-model="searchParams.shape_code"
                  placeholder="选择形体"
                  @click="handleOpenSelect('shape_code')"
                  placeholder-style="color: #999; font-size: 14px;"
                />
              </view>
            </div>

            <view class="filter-section">
              <text class="section-title">热门</text>

              <view class="tags-row">
                <view
                  v-for="item in options"
                  :key="item.value"
                  class="filter-tag"
                  :class="{ active: searchParams.is_hot === item.value }"
                  @click="
                    () => {
                      searchParams.is_hot = item.value
                    }
                  "
                >
                  {{ item.label }}
                </view>
              </view>
            </view>

            <view class="filter-section">
              <text class="section-title">预售</text>

              <view class="tags-row">
                <view
                  v-for="item in options"
                  :key="item.value"
                  class="filter-tag"
                  :class="{ active: searchParams.is_presale === item.value }"
                  @click="
                    () => {
                      searchParams.is_presale = item.value
                    }
                  "
                >
                  {{ item.label }}
                </view>
              </view>
            </view>

            <view class="dropdown-footer">
              <text class="reset-btn" @click="resetFilter">重置</text>
              <text class="confirm-btn" @click="handleSearch">确认搜索</text>
            </view>
          </view>

          <view
            class="screen-mask"
            v-if="showFilter"
            @click="closeFilter"
            @touchmove.stop.prevent
          ></view>
        </view>
      </view>

      <Mine v-if="tabActive === 1"></Mine>

      <scroll-view
        style="height: calc(100% - 94px)"
        scroll-y
        refresher-enabled
        :refresher-triggered="triggered"
        :lower-threshold="20"
        @refresherrefresh="refresh"
        @scrolltolower="scrolltolower"
        v-else
      >
        <view class="card-list" v-if="productList?.length">
          <ShoeCard
            v-for="item in productList"
            :key="item.shoe_id"
            :item="item"
            @change="handleCardClick"
          ></ShoeCard>
        </view>

        <u-empty v-if="!productList?.length" mode="data"></u-empty>
      </scroll-view>
    </view>
  </PageLayout>

  <TabBar v-model="tabActive" />

  <u-select v-model="show" :list="list" @confirm="handleConfirm"></u-select>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import PageLayout from '@/components/pageLayout/index.vue'
import TabBar from '@/components/customTabbar/index.vue'
import Mine from './mine.vue'
import {
  searchShoesPage,
  searchSelectList
} from '@/api/modules/shoe/shoeInterface'
import { Shoe, SelectList } from '@/api/modules/shoe/proto/api'
import { manager as requestManager } from '@/request/manager'
import ShoeCard from '@/components/shoeCard/index.vue'

const paddingTop = ref(25)

const show = ref(false)

const list = ref<{ label: string; value: string }[]>([])

const tabActive = ref(0)

const hasMore = ref(false)

const selectMap = ref<Record<string, SelectList>>()

const showFilter = ref(false)

const focusActive = ref(false)

const options = [
  { label: '全部', value: 0 },
  { label: '是', value: 1 },
  { label: '否', value: 2 }
]

const searchParams = reactive({
  shape_code: '',
  material: '',
  shoe_size: '',
  is_hot: 1,
  is_presale: 0,
  page_num: 1,
  page_size: 10
})

const materialList = [
  {
    label: '',
    value: ''
  },
  {
    label: 'EVA一次',
    value: 'EVA一次'
  },
  {
    label: 'EVA二次',
    value: 'EVA二次'
  },
  {
    label: '橡胶',
    value: '橡胶'
  },
  {
    label: 'TPR',
    value: 'TPR'
  }
]

const triggered = ref(false)

const productList = ref<Shoe[]>([])

const selectMode = ref('')

function closeFilter() {
  showFilter.value = false
  uni.hideKeyboard()
}

function handleOpenSelect(mode: string) {
  selectMode.value = mode

  if (mode === 'material') {
    list.value = materialList as never[]
  }

  if (mode === 'shape_code') {
    if (!searchParams.material) {
      list.value = [{ label: '', value: '' }]
    } else {
      list.value = selectMap.value![searchParams.material].items.map((v) => {
        return {
          label: v,
          value: v
        }
      })

      list.value.unshift({ label: '', value: '' })
    }
  }

  show.value = true
}

function handleConfirm(ev: any) {
  const [item] = ev

  searchParams[selectMode.value] = item.value

  if (selectMode.value === 'material') {
    searchParams.shape_code = ''
  }
}
function resetFilter() {
  searchParams.is_hot = 1
  searchParams.is_presale = 0
  searchParams.shape_code = ''
  searchParams.material = ''
  searchParams.shoe_size = ''
}

async function handleClickSearch() {
  showFilter.value = true

  await nextTick()

  setTimeout(() => {
    focusActive.value = true
  }, 100)
}

async function loadData() {
  const resp = await searchShoesPage({
    shape_code: searchParams.shape_code,
    material: searchParams.material,
    shoe_size: searchParams.shoe_size,
    is_hot: searchParams.is_hot,
    is_presale: searchParams.is_presale,
    by_favour: false,
    has_file: true,
    page_num: searchParams.page_num,
    page_size: searchParams.page_size
  })

  console.log(resp.list)

  productList.value = productList.value.concat(resp?.list || [])

  hasMore.value = resp.total > productList.value.length
}

// 4. 方法
const handleSearch = async () => {
  searchParams.page_num = 1
  productList.value = []
  await loadData()
  showFilter.value = false
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

async function loadSelectData() {
  const resp = await searchSelectList({ select_type: 1 })

  selectMap.value = resp.map
}

const handleCardClick = (item: Shoe) => {
  // 这里可以跳转详情页
  uni.navigateTo({ url: `/pages/detail/index?id=${item.shoe_id}` })
}

function favourDataCallBack(ev: { id: string; flag: boolean }) {
  const find = productList.value.find((v) => v.shoe_id === ev.id)

  if (find) {
    find.is_favour = ev.flag
  }
}

onReady(async () => {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })

  const { safeAreaInsets } = uni.getWindowInfo()

  paddingTop.value = safeAreaInsets.top || 25

  const token = await requestManager.token()

  if (token) {
    loadData()
    loadSelectData()
  }

  uni.$on('refresh', favourDataCallBack)
})

onBeforeUnmount(() => {
  uni.$off('refresh', favourDataCallBack)
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
  position: relative;
  z-index: 10;
  width: 100%;
  background: rgba(245, 247, 250, 0.85); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 磨砂玻璃效果 */
  box-sizing: border-box;

  .header-title {
    padding: 0 16px;

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

.search-wrapper {
  padding: 16px 16px 0; /* 根据你原来的布局调整 */
}

/* 搜索框样式 - 拟态/悬浮感 */
.search-box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 30px;
  padding: 8px 12px;

  .search-input {
    flex: 1;
    margin: 0 10px;
    font-size: 14px;
  }

  .search-btn {
    width: 60px;
    height: 28px;
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

.gary-box {
  background-color: #f5f5f5;
  margin-bottom: 16px;
}

/* 下拉筛选面板 */
.filter-dropdown {
  position: absolute;
  top: 0; /* 在搜索框正下方 */
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 101; /* 比蒙层高，比搜索框低(或平级)均可，看设计需求 */
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 20px 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  &-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
}

.section-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  display: block;
}

.tags-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

/* 筛选标签样式 */
.filter-tag {
  padding: 6px 18px;
  background-color: #f5f5f5;
  color: #666;
  border-radius: 20px;
  font-size: 13px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

/* 选中态 */
.filter-tag.active {
  background-color: rgba(0, 0, 0, 0.9); /* 浅蓝底 */
  border-color: $text-main;
  color: #fff;
}

/* 底部按钮栏 */
.dropdown-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.reset-btn {
  color: #666;
  font-size: 14px;
}

.confirm-btn {
  background: $text-main;
  color: #fff;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 14px;
}

/* 全屏蒙层 */
.screen-mask {
  position: fixed;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99; /* 必须比 filter-dropdown 和 search-box 低 */
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

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
</style>
