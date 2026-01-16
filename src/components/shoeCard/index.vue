<script setup lang="ts">
import { PropType } from 'vue'
import { FileResp, Shoe } from '@/api/modules/shoe/proto/api'

defineProps({
  item: Object as PropType<Shoe>
})

const emits = defineEmits(['change'])

function getImgByFirst(imgList?: FileResp[]) {
  if (!imgList?.length) return ''

  return imgList[0].url
}
</script>

<template>
  <view class="card-item" @click="emits('change', item)">
    <view class="image-wrapper">
      <cover-image
        :src="getImgByFirst(item?.pictures)"
        mode="aspectFill"
        class="product-img"
      />

      <u-icon
        class="tag-favour"
        color="#ff9900"
        :name="item?.is_favour ? 'star-fill' : 'star'"
      ></u-icon>

      <view class="tag-badge">{{ item.shoe_size }}码</view>
    </view>

    <view class="info-wrapper">
      <text class="product-shape">{{ item.shape_code }}</text>

      <view class="meta-row">
        <view class="material-tag">
          <text class="label">材质</text>
          <text class="value">{{ item.material }}</text>
        </view>
      </view>

      <view class="action-row">
        <text class="view-details">查看详情</text>
        <u-icon name="arrow-rightward"></u-icon>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
$card-bg: #ffffff;
$text-main: #1a1a1a;
$text-sub: #8c8c8c;
$accent-color: #5d5fef;

.card-item {
  background: $card-bg;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:active {
    transform: scale(0.98);
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 140px; /* 固定图片高度 */
  background: #f0f0f0;

  .product-img {
    width: 100%;
    height: 100%;
    border-radius: 16px 16px 0 0;
  }

  /* 码数标签悬浮在图片上 */
  .tag-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: bold;
    color: $text-main;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tag-favour {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
.info-wrapper {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .product-shape {
    font-size: 16px;
    font-weight: 700;
    color: $text-main;
    margin-bottom: 8px;
    /* 超出两行省略 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .meta-row {
    margin-bottom: 12px;
  }

  .material-tag {
    display: inline-flex;
    align-items: center;
    background: #f0f2f5;
    padding: 4px 8px;
    border-radius: 4px;

    .label {
      font-size: 10px;
      color: $text-sub;
      margin-right: 4px;
    }

    .value {
      font-size: 11px;
      color: $text-main;
      font-weight: 600;
    }
  }

  .action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #f0f0f0;
    padding-top: 10px;

    .view-details {
      font-size: 12px;
      color: $accent-color;
      font-weight: 600;
    }

    .arrow-icon {
      font-size: 12px;
      color: $text-sub;
    }
  }
}
</style>
