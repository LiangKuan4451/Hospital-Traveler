<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import utf8 from 'utf8'
import { onMounted, ref } from 'vue'

const deletePopup = ref()
const importInputPopup = ref()

function clearStorage() {
  usePageStore().clearStorage()
}

function isVueRef(ref: any): ref is { value: any } {
  return typeof ref === 'object' && 'value' in ref
}

function togglePopup(ref: any, Boolean: boolean) {
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

const exportStorageData = ref({
  accountRes: null,
  calendarRes: [null],
  hospitalRes: null,
  departmentRes: null,
})

const importStorageData = ref()
// 监听plusready事件

function exportData() {
  const jsonString = JSON.stringify(exportStorageData.value)
  const utf8EncodedString = utf8.encode(jsonString)
  const encodeString = btoa(utf8EncodedString)
  console.log('encodeString', encodeString)

  plus.share.sendWithSystem({ type: 'text', content: encodeString, href: '' }, () => {
    // console.log('分享成功')
  }, (e) => {
    // console.log(`分享失败：${JSON.stringify(e)}`)
  })
}

function importData() {
  console.log('importStorageData', importStorageData.value)
  const utf8DecodedString = atob(importStorageData.value)

  const decodedString = utf8.decode(utf8DecodedString)
  console.log('decodedString', decodedString)

  const decodedJson = JSON.parse(decodedString)
  console.log('decodedJson', decodedJson)

  usePageStore().setLocalStorage(decodedJson.calendarRes, decodedJson.accountRes, decodedJson.hospitalRes, decodedJson.departmentRes)
}

function navigateBack() {
  uni.navigateBack()
}
onMounted(() => {
  usePageStore().getLocalStorage()
  exportStorageData.value.accountRes = usePageStore().accountRes.data
  exportStorageData.value.calendarRes = usePageStore().calendarRes.data
  exportStorageData.value.hospitalRes = usePageStore().hospitalRes.data
  exportStorageData.value.departmentRes = usePageStore().departmentRes.data
})
</script>

<template>
  <view class="status-bar" />
  <!--  -->
  <!-- 按钮列表 -->
  <!-- 返回按钮 -->
  <button class="nav" @click="navigateBack">
    <view class="nav-title">
      <text class="nav-icon i-mdi-arrow-back-circle" />
      <text class="align-middle">返 回</text>
    </view>
  </button>
  <!-- 删除数据 -->
  <button class="nav" @click="togglePopup(importInputPopup, true)">
    <view class="nav-title">
      <text class="nav-icon i-mdi-file-export-outline " />
      <text class="align-middle">导入数据</text>
    </view>
  </button>
  <!-- 导出数据 -->
  <button class="nav" @click="exportData">
    <view class="nav-title">
      <text class="nav-icon i-mdi-file-import-outline " />
      <text class="align-middle">导出数据</text>
    </view>
  </button>
  <!-- 导入数据 -->
  <button class="nav" @click="togglePopup(deletePopup, true)">
    <view class="nav-title">
      <text class="nav-icon i-mdi-trash-can " />
      <text class="align-middle">删除数据</text>
    </view>
  </button>
  <!-- 弹出框 -->
  <uni-popup
    ref="deletePopup"
    type="dialog"
  >
    <uni-popup-dialog
      type="warn" cancelText="取消" confirmText="同意" title="通知" content="确定删除所有数据吗？" @confirm="clearStorage"
      @close="togglePopup(deletePopup, false)"
    />
  </uni-popup>
  <uni-popup ref="importInputPopup" type="dialog">
    <uni-popup-dialog
      v-model="importStorageData" mode="input" title=""
      placeholder="粘贴数据" @confirm="importData"
    />
  </uni-popup>
</template>

<style scoped>
button {
  @apply text-left border-none;
}

.nav {
  @apply m-4 p-4 rounded  border border-gray-100 shadow shadow-gray-400 text-lg;
}

.nav-title {
  @apply rounded pl-2;
}

.nav-icon {
  @apply mr-3 align-middle text-2xl text-green-500;
}
</style>
