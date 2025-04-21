<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import { ref } from 'vue'

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
  { title: '选项管理', icon: 'i-mdi-select-place', url: '/pages/manage/selectManage' },
  { title: '数据管理', icon: 'i-mdi-data', url: '/pages/manage/dataManage' },
]
</script>

<template>
  <!-- 导航栏占位符 -->
  <view class="status-bar" />
  <!-- 数据累计 -->
  <view v-for="(item, index) in navList" :key="index" class="nav">
    <navigator
      :url="item.url"
      open-type="navigate"
      hover-class="navigator-hover"
    >
      <view class="nav-title">
        <text class="mr-3 rotate-180 align-middle text-2xl text-green-500" :class="item.icon" />
        <text class="align-middle">{{ item.title }}</text>
      </view>
    </navigator>
  </view>
</template>

<style scoped>
.button-list {
  button {
    @apply my-4;
  }
}

.nav {
  @apply m-4 p-4 rounded border-b border-gray-500 shadow shadow-gray-400 text-lg;
}

.nav-title {
  @apply rounded pl-2;
}
</style>
