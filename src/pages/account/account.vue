<script setup lang="ts">
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

function selectFile() {
  const storageTasks = [
    uni.getStorage({ key: 'calendarData' }),
    uni.getStorage({ key: 'accountData' }),
  ]

  Promise.all(storageTasks).then((res) => {
    console.log(res)
    const fileData = {
      calendarData: res[0].data,
      accountData: res[1].data,
    }
  })
}

function reloadPage() {
  uni.reLaunch({
    url: '/pages/index/index',
  })
}

function clearData() {
  const storageTasks = [
    uni.removeStorage({ key: 'calendarData' }),
    uni.removeStorage({ key: 'accountData' }),
  ]

  Promise.all(storageTasks).then(() => {
    reloadPage()
  })
}
</script>

<template>
  <view class="button-list mx-auto w-3/4">
    <button plain @click="deleteDialog.open">
      清除数据
    </button>
    <button plain @click="deleteDialog.open">
      导出数据
    </button>
    <button plain @click="selectFile">
      导入数据
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
.button-list {
  button {
    @apply my-4;
  }
}
</style>
