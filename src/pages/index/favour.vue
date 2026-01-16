<script setup lang="ts">
import PageLayout from '@components/pageLayout/index.vue'
import { onMounted, reactive, ref } from 'vue'
import ShoeCard from '@/components/shoeCard/index.vue'
import { Shoe } from '@/api/modules/shoe/proto/api'
import { searchShoesPage } from '@/api/modules/shoe/shoeInterface'

const productList = ref<Shoe[]>([])

const hasMore = ref(false)

const triggered = ref(false)

const searchParams = reactive({
  page_num: 1,
  page_size: 10
})

async function loadData() {
  const resp = await searchShoesPage({
    shape_code: '',
    material: '',
    shoe_size: '',
    is_hot: 0,
    is_presale: 0,
    by_favour: true,
    page_num: searchParams.page_num,
    page_size: searchParams.page_size
  })

  productList.value = productList.value.concat(resp?.list || [])

  hasMore.value = resp.total > productList.value.length
}

const handleCardClick = (item: Shoe) => {
  // 这里可以跳转详情页
  uni.navigateTo({ url: `/pages/detail/index?id=${item.shoe_id}` })
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

onMounted(() => {
  loadData()
})
</script>

<template>
  <u-navbar back-icon-size="26" back-text="" title="我的收藏"> </u-navbar>

  <PageLayout>
    <scroll-view
      style="height: 100%"
      class="content-section"
      scroll-y
      refresher-enabled
      :refresher-triggered="triggered"
      :lower-threshold="20"
      @refresherrefresh="refresh"
      @scrolltolower="scrolltolower"
    >
      <div class="card-list">
        <ShoeCard
          v-for="item in productList"
          :key="item.shoe_id"
          :item="item"
          @change="handleCardClick"
        ></ShoeCard>
      </div>
    </scroll-view>
  </PageLayout>
</template>

<style scoped lang="scss">
.content-section {
  padding: 16px;
  height: 100%;
  overflow: auto;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 两列布局 */
  gap: 15px;
}
</style>
