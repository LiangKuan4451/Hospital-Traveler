<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import { onMounted, ref } from 'vue'

const appVersion = ref('')

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

function getAppVetsion() {
  uni.getSystemInfo({
    success: (result) => {
      console.log(result)
      appVersion.value = result?.appVersion

      console.log(appVersion.value)
    },
  })
}

function navigateTo(pageurl) {
  uni.navigateTo({
    url: pageurl,
  })
}

const navList = computed(() => [
  { title: '选项管理', icon: 'i-mdi-select-place rotate-180', url: '/pages/manage/selectManage' },
  { title: '数据管理', icon: 'i-mdi-data', url: '/pages/manage/dataManage' },
  { title: 'yingyu4451', icon: 'i-mdi-github', url: '/pages/account/account' },
  { title: appVersion?.value, icon: 'i-mdi-tag', url: '/pages/account/account' },
])

onMounted(() => {
  getAppVetsion()
})
</script>

<template>
  <!-- 导航栏占位符 -->
  <view class="status-bar" />
  <!-- 数据累计 -->
  <button v-for="(item, index) in navList" :key="index" class="nav" @click="navigateTo(item.url)">
    <view class="nav-title">
      <text class="mr-3 align-middle text-2xl text-green-500" :class="item.icon" />
      <text class="align-middle">{{ item.title }}</text>
      <text class="mx-3 align-middle">{{ item?.text || '' }}</text>
    </view>
  </button>
</template>

<style scoped>
.button-list {
  button {
    @apply my-4;
  }
}
button {
  @apply text-left border-none;
}
.nav {
  @apply m-4 p-4 rounded border border-gray-100 shadow shadow-gray-400 text-lg;
}

.nav-title {
  @apply rounded pl-2;
}
</style>
