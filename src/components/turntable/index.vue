<template>
  <view class="ide-box">
    <view class="ide-box-circleGroup">
      <view
        class="ide-box-circleGroup-circle"
        v-for="circle in 16"
        :key="circle"
        :style="{ transform: `rotate(${22.5 * circle}deg)` }"
      ></view>

      <view class="ide-box-circleGroup-border">
        <view
          class="ide-box-circleGroup-border-turntable"
          :animation="animation"
        >
          <view
            v-for="(item, index) in prizeList"
            :key="item.id"
            class="ide-box-circleGroup-border-turntable-prize"
            :style="{
              transform: `rotate(${60 * index}deg) skewY(${30}deg)`
            }"
          >
            <image class="prize-icon" :src="item.image"></image>
            <view class="prize-text">{{ item.value }}</view>
          </view>
        </view>

        <view class="start-icon" @click="handleStart">GO</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    prizeList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: [],
  data() {
    return {
      retry: false,
      animation: {},
      rotate: 0
    }
  },
  methods: {
    handleStart() {
      if (this.retry) return
      this.retry = true
      const animation = uni.createAnimation({
        duration: 10000,
        delay: 0,
        timingFunction: 'ease'
      })
      this.rotate += 3600
      animation.rotate(this.rotate).step()
      this.animation = animation.export()
      setTimeout(() => {
        this.retry = false
        this.animation = {}
      }, 10000)
    }
  }
}
</script>

<style lang="scss">
.ide-box {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(to bottom, #75c6fc, #174bc8);
  padding: 5px;
  z-index: 1;
  margin: 0 auto;

  &-circleGroup {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(to bottom, #56a5fa, #346eff);
    padding: 16px;

    &-circle {
      position: absolute;
      left: 50%;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-left: -5px;
      margin-top: -13px;
      background: #fff;
      transform-origin: 5px 142px;
      box-shadow: 0 0 10px #fff;
    }

    &-border {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      padding: 10px;
      background: linear-gradient(to bottom, #2584ff, #1050fe);

      &-turntable {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #2388fe;
        overflow: hidden;

        &-prize {
          width: 119px;
          height: 119px;
          position: absolute;
          left: 0;
          top: 0;
          transform-origin: right bottom;

          .prize-icon {
            width: 30px;
            height: 30px;
            transform: skewY(-30deg) rotate(-30deg) translate(10px, 110px);
            transform-origin: center center;
          }

          .prize-text {
            font-size: 14px;
            width: max-content;
            color: #fff;
            transform: skewY(-30deg) rotate(-30deg) translate(26px, 115px);
            transform-origin: center center;
          }

          &:nth-child(odd) {
            background-color: #3571ff;
          }

          &:nth-child(even) {
            background-color: #6db5ff;
          }
        }
      }
      .start-icon {
        position: absolute;
        z-index: 1;
        width: 60px;
        height: 60px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        background: #f0ad4e;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 60px;
        font-size: 24px;
      }
    }
  }
}
</style>
