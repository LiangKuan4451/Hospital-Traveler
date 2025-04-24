<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import { onMounted, onUnmounted, ref } from 'vue'

const deleteDialog = ref()
const hospitalRes = ref()
const departmentRes = ref()

// 添加这些变量来存储当前要删除的项目信息
const currentDeleteRef = ref()
const currentDeleteIndex = ref()
const currentDeleteNavName = ref('')

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

function deleteSelect(ref, refDataIndex, navName) {
  const refData = isVueRef(ref) ? ref.value : ref
  refData.splice(refDataIndex, 1)
  uni.setStorage({ key: navName, data: refData })
}

const navList = [
  { title: '医院选项', icon: 'i-mdi-select-place', name: 'departments' },
  { title: '科室选项', icon: 'i-mdi-data', name: 'hospitals' },
]

// 修改为打开确认对话框的函数
function confirmDelete(ref, refDataIndex, navName) {
  // 存储当前要删除的项目信息
  currentDeleteRef.value = ref
  currentDeleteIndex.value = refDataIndex
  currentDeleteNavName.value = navName

  // 打开确认对话框
  togglePopup(deleteDialog, true)
}

// 添加一个新函数来处理确认删除
function handleDeleteConfirm() {
  // 执行删除操作
  deleteSelect(currentDeleteRef.value, currentDeleteIndex.value, currentDeleteNavName.value)

  // 关闭对话框
  togglePopup(deleteDialog, false)
}

function navigateBack() {
  uni.navigateBack()
}

onMounted(() => {
  usePageStore().getLocalStorage()
  hospitalRes.value = usePageStore().hospitalRes?.data
  departmentRes.value = usePageStore().departmentRes?.data
})

onUnmounted(() => {
  usePageStore().getLocalStorage()
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
  <!-- 选项列表 -->
  <!--  -->
  <view v-for="(nav, navIndex) in navList" :key="navIndex" class="nav">
    <view class="nav-title">
      <text class="nav-icon i-mdi-map-marker" />
      <text class="align-middle">{{ nav.title }}</text>
    </view>
    <!-- 医院选项 -->
    <view v-if="navIndex === 1" class="nav-list">
      <view v-for="(hospital, index) in hospitalRes" :key="index">
        <text>{{ hospital }}</text>
        <text class="float-right text-red-500" @click="confirmDelete(hospitalRes, index, nav.name)">删除</text>
      </view>
    </view>
    <!-- 科室选项 -->
    <view v-else class="nav-list">
      <view v-for="(department, index) in departmentRes" :key="index">
        <text>{{ department }}</text>
        <text class="float-right text-red-500" @click="confirmDelete(departmentRes, index, nav.name)">删除</text>
      </view>
    </view>
  </view>
  <!-- 弹出框 -->
  <uni-popup
    ref="deleteDialog"
    type="dialog"
  >
    <uni-popup-dialog
      type="warn"
      cancelText="取消"
      confirmText="确认"
      title="通知"
      content="确定删除所选数据吗？"
      @confirm="handleDeleteConfirm"
      @close="togglePopup(deleteDialog, false)"
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
  @apply rounded;
}

.nav-icon {
  @apply mr-1 align-middle text-2xl text-green-500;
}

.nav-list {
  @apply pl-[0.7rem] text-base;

  view {
    @apply border-l-2 my-3 pl-4 border-green-500;
  }
}
</style>
