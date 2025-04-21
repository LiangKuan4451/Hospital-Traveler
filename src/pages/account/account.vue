<script setup lang="ts">
// import createClient from '@/static/supabase/supabase-js/dist/module/SupabaseClient'
import { usePageStore } from '@/stores/Pages'
import { ref } from 'vue'

const deleteDialog = ref()

function clearStorage() {
  usePageStore().clearStorage()
}

function togglePopup(ref: any, Boolean: boolean, data: any) {
  console.log('popupActio', ref)

  try {
    if (Boolean) {
      ref.value.open()
    }
    else {
      ref.value.close()
    }
  }
  catch (error) {
    console.log('error', error)
    if (Boolean) {
      ref.open()
    }
    else {
      ref.close()
    }
  }
}

function FileSystem() {
  plus.io.requestFileSystem(plus.io.PRIVATE_WWW, (fs) => {
    // 可通过fs进行文件操作
    console.log(`File system: ${fs.root?.fullPath}`)
    // 通过fs.root获取DirectoryEntry对象进行操作
    // fs.root
  }, (e) => {
    console.log(`Request file system failed: ${e.message}`)
  })
}

const navList = [
  { title: '选项管理', icon: 'i-mdi-select-place', url: '/pages/option/option' },
  { title: '数据管理', icon: 'i-mdi-data', url: '/pages/option/option' },
]
</script>

<template>
  <!-- 导航栏占位符 -->
  <view class="status-bar" />
  <!-- 数据累计 -->
  <view v-for="(item, index) in navList" :key="index" class="nav">
    <view class="nav-title">
      <text class="mr-3 rotate-180 align-middle text-2xl text-green-500" :class="item.icon" />
      <text class="align-middle">{{ item.title }}</text>
    </view>
  </view>
  <!-- 数据按钮 -->
  <uni-section title="数据管理" type="line" />
  <view class="button-list mx-auto w-3/4">
    <button plain @click="deleteDialog.open">
      清除数据
    </button>
    <button plain @click="FileSystem">
      备份数据
    </button>
  </view>
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
.button-list {
  button {
    @apply my-4;
  }
}
.nav {
  @apply m-4 p-4 rounded shadow-sm shadow-gray-400 text-lg;
}
.nav-title {
  @apply rounded border-l-blue-500 pl-2;
}
</style>
