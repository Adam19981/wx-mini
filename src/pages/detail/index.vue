<template>
  <view class="detail-container">
    <view class="nav-bar" :style="{ paddingTop: paddingTop + 'px' }">
      <u-icon
        name="arrow-left"
        class="nav-btn back-btn"
        @click="goBack"
      ></u-icon>
    </view>

    <view class="swiper-container">
      <swiper
        class="media-swiper"
        :indicator-dots="true"
        indicator-active-color="#fff"
        indicator-color="rgba(255,255,255,0.4)"
        :autoplay="false"
        @change="handleSwiperChange"
      >
        <swiper-item>
          <view
            class="video-wrapper"
            v-for="video in product?.videos"
            :key="video.id"
          >
            <video
              id="productVideo"
              class="media-item"
              :src="video.url"
              :autoplay="true"
              :loop="true"
              :muted="true"
              :controls="false"
              object-fit="cover"
            ></video>
            <view class="video-tag">
              <text class="dot"></text> LIVE PREVIEW
            </view>
          </view>
        </swiper-item>

        <swiper-item v-for="img in product?.pictures" :key="img.id">
          <image class="media-item" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <view class="slide-indicator">
        <text class="count-text">
          <text class="curr">{{ currentIndex + 1 }}</text>
          <text class="divider">/</text>
          <text class="total">{{ totalCount }}</text>
        </text>
      </view>
    </view>

    <view class="content-card">
      <view class="drag-handle"></view>

      <view class="header-info">
        <view class="title-row">
          <text class="product-shape">{{ product?.shape_code || '' }}</text>
          <view
            class="rating-badge"
            v-if="product?.is_presale"
            style="background: #2979ff"
            >预售</view
          >
          <view
            class="rating-badge"
            v-if="product?.is_hot"
            style="background: #fa3534"
            >热门</view
          >
        </view>
      </view>

      <view class="divider"></view>

      <view class="section-block">
        <text class="section-title">MATERIAL / 材质</text>
        <view class="material-grid">
          <view class="material-item active">
            <text class="mat-name">{{ product?.material || '' }}</text>
          </view>
        </view>
      </view>

      <view class="section-block">
        <view class="section-header">
          <text class="section-title">SIZE / 码数</text>
        </view>
        <scroll-view scroll-x class="size-scroll" :show-scrollbar="false">
          <view class="size-list">
            <view class="size-item active">
              <text class="size-num">{{ product?.shoe_size || '' }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!--      <view class="section-block">-->
      <!--        <text class="section-title">STORY / 设计理念</text>-->
      <!--        <text class="description-text">-->
      <!--          这款 {{ product.shape }} 采用了全新的解构主义设计语言。-->
      <!--          {{ product.materials[selectedMaterial] || product.materials[0] }}-->
      <!--          赋予了鞋身极佳的质感与透气性。-->
      <!--          中底搭载回弹科技，无论是城市漫步还是机能穿搭，都能提供卓越的脚感支持。-->
      <!--        </text>-->
      <!--      </view>-->

      <view style="height: 60px"></view>
    </view>

    <view class="bottom-action-bar">
      <view
        class="action-btn collect-pill"
        :class="{ 'is-active': isCollected }"
        @click="toggleCollection"
      >
        <view class="icon-wrapper" :class="{ pulse: isAnimating }">
          <text class="icon">{{ isCollected ? '♥' : '♡' }}</text>
        </view>

        <text class="btn-text">{{ isCollected ? '已收藏' : '加入收藏' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ShoeByIdResp } from '@/api/modules/shoe/proto/api'
import { changeShoeFavour, shoeById } from '@/api/modules/shoe/shoeInterface'

// 模拟刘海屏高度，实际开发可用 uni.getSystemInfoSync() 获取
const paddingTop = ref(25)

const shoe_id = ref('')
// 模拟数据
const product = ref<ShoeByIdResp>()

const currentIndex = ref(0)

// 计算总数 (视频1个 + 图片数量)
const totalCount = computed(() => {
  return (
    (product.value?.pictures?.length ? product.value.pictures.length : 0) +
    (product.value?.videos?.length ? product.value.videos.length : 0)
  )
})

// 状态管理

const isCollected = ref<boolean>(false)

const isAnimating = ref<boolean>(false)

// 方法
const goBack = () => {
  uni.navigateBack()
}

async function loadData() {
  const resp = await shoeById({
    shoe_id: shoe_id.value
  })

  console.log(resp)

  product.value = resp

  isCollected.value = resp.is_favour
}

const toggleCollection = async () => {
  // 1. 触发震动反馈
  uni.vibrateShort({ success: () => {} })

  isAnimating.value = true

  await changeShoeFavour({
    shoe_ids: [shoe_id.value],
    is_favour: !isCollected.value
  })

  await loadData()

  isAnimating.value = false

  if (isCollected.value) {
    uni.showToast({ title: '已加入心愿单', icon: 'none' })
  }
}

const handleSwiperChange = (e: any) => {
  currentIndex.value = e.detail.current
  // 如果需要，可以在这里处理视频暂停/播放逻辑
  // 例如滑到图片页时暂停视频
}

onReady(() => {
  const { safeAreaInsets } = uni.getWindowInfo()
  paddingTop.value = safeAreaInsets.top || 25
})

onLoad((query) => {
  console.log(query)
  shoe_id.value = query.id || ''

  loadData()
})
</script>

<style lang="scss" scoped>
/* 变量定义 */
$primary-black: #1a1a1a;
$accent-blue: #4a6cf7;
$bg-grey: #f8f9fc;
$text-grey: #888;
$white: #ffffff;

.detail-container {
  background-color: $bg-grey;
  min-height: 100vh;
  position: relative;
}

/* 1. 导航栏 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  box-sizing: border-box;

  .nav-btn {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* 2. 媒体轮播容器 (设置为相对定位，作为锚点) */
.swiper-container {
  position: relative;
  width: 100%;
  height: 500px;
}

.media-swiper {
  width: 100%;
  height: 500px; /* 占据屏幕约 60% 高度 */
  background: #000;

  .media-item {
    width: 100%;
    height: 100%;
  }

  .video-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    .video-tag {
      position: absolute;
      bottom: 60px; /* 留出位置给卡片遮挡 */
      left: 20px;
      color: #fff;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;

      .dot {
        width: 6px;
        height: 6px;
        background: red;
        border-radius: 50%;
        margin-right: 6px;
        animation: blink 1s infinite;
      }
    }
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

/* [新增] 动态滑动提示胶囊样式 */
.slide-indicator {
  position: absolute;
  bottom: 50px; /* 位于白色卡片上方 */
  right: 20px;
  background: rgba(0, 0, 0, 0.6); /* 深色半透明底 */
  backdrop-filter: blur(8px); /* 磨砂效果 */
  padding: 6px 14px;
  border-radius: 20px; /* 胶囊形状 */
  display: flex;
  align-items: center;
  z-index: 20;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  .count-text {
    font-family: 'Helvetica Neue', sans-serif; /* 数字用无衬线字体更好看 */
    color: rgba(255, 255, 255, 0.9);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;

    .curr {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }

    .divider {
      margin: 0 3px;
      font-size: 10px;
      background: transparent;
    }

    .total {
      opacity: 0.8;
    }
  }
}

/* 之前的视频标签样式微调，避免重叠 */
.video-tag {
  /* 保持左下角 */
  position: absolute;
  bottom: 50px;
  left: 20px;
  /* ...其余保持不变 */
}

/* 3. 详情卡片 */
.content-card {
  position: relative;
  margin-top: -40px; /* 负边距实现上浮覆盖效果 */
  background: $white;
  border-radius: 32px 32px 0 0;
  padding: 10px 25px 40px;
  z-index: 10;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);

  .drag-handle {
    width: 40px;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    margin: 10px auto 20px;
  }
}

/* 头部信息 */
.header-info {
  margin-bottom: 20px;

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;

    .product-shape {
      font-size: 28px;
      font-weight: 800;
      color: $primary-black;
      width: 70%;
      line-height: 1.1;
    }

    .rating-badge {
      background: $primary-black;
      color: #fff;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 12px;
      font-weight: 600;
    }
  }
}

.divider {
  height: 1px;
  background: #f0f0f0;
  margin: 20px 0;
}

/* 通用分栏标题 */
.section-block {
  margin-bottom: 30px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 13px;
    color: $text-grey;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    display: block;
    margin-bottom: 12px;
  }

  .size-guide {
    font-size: 12px;
    color: $accent-blue;
    text-decoration: underline;
  }
}

/* 材质选择网格 */
.material-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .material-item {
    padding: 10px 16px;
    border: 1px solid #eee;
    border-radius: 12px;
    background: #f9f9f9;
    color: $primary-black;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    position: relative;

    &.active {
      border-color: $primary-black;
      background: $primary-black;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
  }
}

/* 码数横向滚动 */
.size-scroll {
  white-space: nowrap;
  width: 100%;

  .size-list {
    display: flex;
    padding: 5px 0; /* 留出阴影空间 */
  }

  .size-item {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    border-radius: 50%; /* 圆形 */
    background: #fff;
    border: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    transition: all 0.2s;

    .size-num {
      font-size: 16px;
      font-weight: 600;
      color: $primary-black;
    }

    &.active {
      background: $accent-blue;
      border-color: $accent-blue;
      box-shadow: 0 4px 10px rgba(74, 108, 247, 0.3);

      .size-num {
        color: #fff;
      }
    }
  }
}

/* 描述文本 */
.description-text {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
  text-align: justify;
}

/* 4. 底部悬浮栏 */

.bottom-action-bar {
  position: fixed;
  bottom: 30px; /* 稍微抬高一点，显得更轻盈 */
  left: 30px;
  right: 30px;
  height: 64px;
  /* 移除背景模糊，改为全透明，让按钮自己独立悬浮，更加通透 */
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 99;
  pointer-events: none; /* 容器穿透，不阻挡底部内容 */

  .action-btn {
    pointer-events: auto; /* 按钮恢复点击 */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:active {
      transform: scale(0.95);
    }
  }

  /* 左侧分享圆钮 */
  .share-circle {
    width: 54px;
    height: 54px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 0, 0.05);

    .icon {
      font-size: 22px;
    }
  }

  /* 右侧收藏胶囊 */
  .collect-pill {
    flex: 1;
    margin-left: 15px;
    height: 54px;
    background: #1a1a1a; /* 默认黑底 */
    border-radius: 27px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    overflow: hidden;
    position: relative;

    .icon-wrapper {
      margin-right: 8px;
      display: flex;
      align-items: center;

      .icon {
        font-size: 20px;
        color: #fff;
        transition: color 0.3s;
      }

      /* 心跳动画 keyframes */
      &.pulse {
        animation: heartBeat 0.4s ease-in-out;
      }
    }

    .btn-text {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 0.5px;
    }

    .count-badge {
      margin-left: auto; /* 推到最右边 */
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 10px;

      text {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }
    }

    /* 激活状态（已收藏） */
    &.is-active {
      background: #ffffff; /* 变白底 */
      border: 1px solid rgba(0, 0, 0, 0.05);

      .icon {
        color: #ff4757; /* 红心 */
      }

      .btn-text {
        color: #1a1a1a; /* 黑字 */
      }
    }
  }
}

/* 关键帧动画 */
@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
</style>
