<script setup lang="ts">
import calendar from '@/components/uni_modules/uni-calendar/components/uni-calendar/calendar'
import uniPopupDialog from '@/components/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.vue'
import { ref } from 'vue'

const deleteDialog = ref()

function popupAction(ref: any, Boolean: boolean) {
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

function reloadPage() {
  uni.reLaunch({
    url: '/pages/index/index',
  })
}

function clearData() {
  const storageTasks= [
    uni.removeStorage({key:'calendarData'}),
    uni.removeStorage({key:'accountData'})
  ]

  Promise.all(storageTasks).then(()=>{
    reloadPage()
  })
}
</script>

<template>
  <view>
    <button @click="deleteDialog.open">
      清除数据
    </button>
  </view>
  <uni-popup
    ref="deleteDialog"
    type="dialog"
  >
    <uni-popup-dialog
      type="warn" cancelText="取消" confirmText="同意" title="通知" content="确定删除所有数据吗？" @confirm="clearData"
      @close="popupAction(deleteDialog, false)"
    />
  </uni-popup>
</template>

<style scoped>

</style>
