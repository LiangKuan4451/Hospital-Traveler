<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import { ref } from 'vue'

const deleteDialog = ref()

function clearStorage() {
  usePageStore().clearStorage()
}

function isVueRef(ref: any): ref is { value: any } {
  return typeof ref === 'object' && 'value' in ref
}

function togglePopup(ref: any, Boolean: boolean, data: any) {
  if (!ref) { return }
  const popup = isVueRef(ref) ? ref.value : ref // 统一处理 ref

  try {
    if (Boolean) {
      popup.open()
    }
    else {
      popup.close()
    }
  }
  catch (error) {
    console.log('error', error)
  }
}

const navList = [
  { title: '选项管理', icon: 'i-mdi-select-place', func: togglePopup(deleteDialog?.value, true) },
  { title: '数据管理', icon: 'i-mdi-data', func: togglePopup(deleteDialog?.value, true) },
]
</script>

<template>
  <view class="status-bar" />
  <!--  -->
  <!-- 按钮列表 -->
  <!-- 返回按钮 -->
  <navigator
    open-type="navigateBack"
    hover-class="navigator-hover"
  >
    <button class="nav">
      <view class="nav-title">
        <text class="nav-icon i-mdi-arrow-back-circle" />
        <text class="align-middle">返 回</text>
      </view>
    </button>
  </navigator>
  <!-- 删除数据 -->
  <button class="nav" @click="togglePopup(deleteDialog, true)">
    <view class="nav-title">
      <text class="nav-icon i-mdi-file-export-outline " />
      <text class="align-middle">导入数据</text>
    </view>
  </button>
  <!-- 导出数据 -->
  <button class="nav" @click="togglePopup(deleteDialog, true)">
    <view class="nav-title">
      <text class="nav-icon i-mdi-file-image-outline " />
      <text class="align-middle">导出数据</text>
    </view>
  </button>
  <!-- 导入数据 -->
  <button class="nav" @click="togglePopup(deleteDialog, true)">
    <view class="nav-title">
      <text class="nav-icon i-mdi-trash-can " />
      <text class="align-middle">删除数据</text>
    </view>
  </button>
  <!-- 弹出框 -->
  <uni-popup
    ref="deleteDialog"
    type="dialog"
  >
    <uni-popup-dialog
      type="warn" cancelText="取消" confirmText="同意" title="通知" content="确定删除所有数据吗？" @confirm="clearStorage"
      @close="togglePopup(deleteDialog, false)"
    />
  </uni-popup>
</template>

<style scoped>
.nav {
  @apply m-4 p-4 rounded border-b border-gray-500 shadow shadow-gray-400 text-lg bg-white;
}

.nav-title {
  @apply rounded pl-2;
}

.nav-icon {
  @apply mr-3 align-middle text-2xl text-green-500;
}
</style>
