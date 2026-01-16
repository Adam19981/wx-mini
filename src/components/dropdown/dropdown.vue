<template>
  <div class="ide-dropdown">
    <div
      class="ide-dropdown-item"
      v-for="item in dropItemList"
      :key="item.label"
      @click="handleClick(item)"
      :class="{ 'ide-dropdown-active': item.isOpen }"
    >
      <span>{{ setDropItemLabel(item) }}</span>
      <uni-icons
        v-if="!item.isOpen"
        :type="mode === 'bottom' ? 'bottom' : 'top'"
        size="16"
      ></uni-icons>
      <uni-icons
        v-else
        :type="mode === 'bottom' ? 'top' : 'bottom'"
        size="16"
      ></uni-icons>
    </div>

    <div class="ide-dropdown-panel" :class="`ide-dropdown-panel-${mode}`">
      <template v-for="item in dropItemList" :key="item.label">
        <slot
          v-if="item.label === activeDropItem?.label && activeDropItem?.isOpen"
          :name="item.label"
        ></slot>
      </template>

      <div
        class="ide-dropdown-panel-content"
        :class="`ide-dropdown-panel-content-${mode}`"
        :style="{ height: setPanelHeight(), maxHeight: maxHeight + 'rpx' }"
      >
        <div
          class="ide-dropdown-panel-content-item"
          v-for="item in panelList"
          :key="item.value"
          @click="handleClickChildren(item)"
          :class="{
            'ide-dropdown-active': activeDropItem?.value === item.value
          }"
        >
          {{ item.label }}
        </div>
      </div>

      <div
        class="ide-dropdown-panel-mask"
        :class="`ide-dropdown-panel-mask-${mode}`"
        @click="activeDropItem.isOpen = false"
        v-show="dropItemList.some((v) => v.isOpen)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType, ref, getCurrentInstance, onMounted } from 'vue'
import { DropdownOption, DropdownChildren, Mode } from './symbol'

const instance = getCurrentInstance() // 获取组件实例

const emit = defineEmits(['change'])

const props = defineProps({
  list: {
    type: Array as PropType<DropdownOption[]>,
    default: () => []
  },
  mode: {
    type: String as PropType<Mode>,
    default: 'bottom'
  },
  maxHeight: Number
})

const dropItemList = computed(() => {
  return props.list?.map((item) => {
    item.isOpen = false
    return item
  })
})

const cuttingHeight = ref<string>('0px') // 计算蒙层的高度

const activeDropItem = ref<DropdownOption>() // 当前激活的item

const panelList = ref<DropdownChildren[]>([])

onMounted(() => {
  // 动态获取组件挂载的位置，用于计算蒙层的高度
  const query = uni.createSelectorQuery().in(instance)
  query
    .select('.ide-dropdown-panel')
    .boundingClientRect((rect) => {
      if (Array.isArray(rect)) return
      // 获取到元素
      if (rect?.top) {
        if (props.mode === 'bottom') {
          cuttingHeight.value = `${rect.top}px`
        } else {
          cuttingHeight.value = `${rect.bottom}px`
        }
      }
    })
    .exec()
})

function handleClick(item: DropdownOption) {
  if (activeDropItem.value && activeDropItem.value?.label !== item.label) {
    activeDropItem.value.isOpen = false
  }
  panelList.value = item.children
  item.isOpen = !item.isOpen
  activeDropItem.value = item
}

function handleClickChildren(item: DropdownChildren) {
  if (!activeDropItem.value) return
  activeDropItem.value.value = item.value
  activeDropItem.value.isOpen = false
  emit('change', item, activeDropItem.value)
}

function setDropItemLabel(item: DropdownOption) {
  const { children } = item
  const panelItem = children.find((v) => v.value === item.value)
  if (!panelItem) {
    return item.label
  }
  return panelItem.label === '全部' ? item.label : panelItem.label
}

function setPanelHeight() {
  const isOpen = dropItemList.value?.some((item) => item.isOpen)
  if (!isOpen) return 0
  return `${94 * panelList.value!.length}rpx`
}

function close() {
  if (activeDropItem.value?.isOpen) {
    activeDropItem.value.isOpen = false
  }
}

defineExpose({
  close
})
</script>

<style scoped lang="scss">
.ide-dropdown {
  z-index: 10;
  width: 100%;
  padding: 10px 16px;
  position: relative;
  display: flex;
  align-items: center;

  &-item {
    display: flex;
    align-items: center;
    margin-right: 30px;

    label {
      margin-right: 5px;
      font-weight: 500;
    }
  }
  &-item:last-child {
    margin-right: 0;
  }

  &-panel {
    position: absolute;
    left: 0;
    width: 100%;

    &-bottom {
      top: 40px;
    }

    &-top {
      bottom: 40px;
    }

    &-content {
      width: 100%;
      z-index: 2;
      position: absolute;
      transition: 0.3s;
      left: 0;
      background: #fff;
      overflow: auto;

      &-top {
        bottom: 0;
      }
      &-bottom {
        top: 0;
      }

      &-item {
        height: 47px;
        line-height: 47px;
        padding-left: 16px;
        font-size: 14px;
        border-bottom: 1px solid #eee;
      }
    }

    &-mask {
      z-index: 1;
      width: 100%;
      position: absolute;
      left: 0;
      background: rgba(0, 0, 0, 0.3);

      &-bottom {
        top: 0;
        height: calc(
          100vh - v-bind(cuttingHeight) - env(safe-area-inset-bottom)
        );
      }

      &-top {
        bottom: 0;
        height: v-bind(cuttingHeight);
      }
    }
  }
}

.ide-dropdown-active {
  color: #2979ff;
}
</style>
