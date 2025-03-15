<script setup lang="ts">
import { onMounted, ref } from 'vue'

const calendar = ref()
const calendarData = ref<any[]>([])
const calendarPopup = ref()
const currentSelectedDate = ref<any>()
const calendarRefData = ref<any>()

const accountData = ref<any>({})

const nowDate = new Date()
const nowHours = nowDate.getHours()
const nowMinutes = nowDate.getMinutes()

const hours = ref(Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')))
const minutes = ref(Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')))

const pickerViewData = ref([nowHours, ':', nowMinutes])

function isVueRef(ref: any): ref is { value: any } {
  return typeof ref === 'object' && 'value' in ref
}

function togglePopup(ref: any, isOpen: boolean) {
  if (!ref) { return }
  const popup = isVueRef(ref) ? ref.value : ref // 统一处理 ref
  if (isOpen) {
    popup.open()
  }
  else {
    popup.close()
  }
}

function reloadPage() {
  uni.reLaunch({
    url: '/pages/index/index',
  })
}

function setLocalStorage() {
  const storageTasks = [
    uni.setStorage({ key: 'calendarData', data: calendarData.value }),
    uni.setStorage({ key: 'accountData', data: accountData.value }),
  ]

  Promise.all(storageTasks)
    .then(() => {
      console.log('Storage saved successfully')
      reloadPage()
    })
    .catch((error) => {
      console.error('Failed to save storage:', error)
    })
}

function selecteDate(dateData: any) {
  // console.log(timePicker)
  console.log('dateData', dateData)
  console.log('calendar.value.cale.date', calendar.value)

  currentSelectedDate.value = dateData
  // console.log(calendar.value)
  togglePopup(calendarPopup, true)
}

function addDate(dateData: any) {
  console.log('addDate', dateData)
  const { year, month, fulldate, date: day } = isVueRef(dateData) ? dateData.value : dateData
  if (!accountData.value[year]) {
    accountData.value[year] = { visitCount: 0 }
  }
  if (!accountData.value[year][month]) {
    accountData.value[year][month] = { days: {}, visitCount: 0 }
  }
  if (!accountData.value[year][month].days[day]) {
    accountData.value[year][month].days[day] = []
  }
  calendarData.value.push({ date: fulldate, info: '已签到' })
  accountData.value[year].visitCount++
  accountData.value[year][month].visitCount++
  accountData.value[year][month].days[day].push({ time: pickerViewData.value.join('') })
  console.log(accountData.value[year])

  setLocalStorage()
}

function deleteDate(dateData: any) {
  const { year, month, fulldate, date: day } = isVueRef(dateData) ? dateData.value : dateData

  // 删除 calendarData 中的数据
  calendarData.value = calendarData.value.filter((item: any) => item.date !== fulldate)

  // 删除 accountData 中的数据
  if (accountData.value[year] && accountData.value[year][month]) {
    if (accountData.value[year][month].days[day]) {
      delete accountData.value[year][month].days[day]
      accountData.value[year][month].visitCount--
      accountData.value[year].visitCount--
    }
  }
  togglePopup(calendarPopup, false)
  setLocalStorage()
}

async function loadStorageData() {
  try {
    const calendarRes = await uni.getStorage({ key: 'calendarData' })
    calendarData.value = calendarRes.data
    const accountRes = await uni.getStorage({ key: 'accountData' })
    accountData.value = accountRes.data
  }
  catch (error) {
    console.error('没有数据：', error)
  }
}

watch(
  () => calendar.value?.cale.date,
  (newVal) => {
    console.log('calendarRefData', newVal)

    calendarRefData.value = newVal
  },
  {deep: true,}
)
// watch(
//   calendar,
//   (newVal) => {
//     console.log('calendarRefData', newVal)
//   },
// )

onMounted(() => {
  loadStorageData()
  calendarRefData.value = calendar.value?.cale?.date
})
</script>

<template>
  <view>
    <uni-calendar ref="calendar" :selected="calendarData" @change="selecteDate" />
    <view class="mx-auto columns-2 text-center">
      <view>
        月累计
        <view>
          {{ accountData[calendarRefData?.year]?.[calendarRefData?.month]?.visitCount || 0 }}
        </view>
      </view>
      <view>
        年累计
        <view>
          {{ accountData[calendarRefData?.year]?.visitCount || 0 }}
        </view>
      </view>
    </view>
    <uni-popup
      ref="calendarPopup"
      type="bottom"
      background-color="#fff"
      borderRadius="20px 20px 0 0"
      class="popup"
    >
      <picker-view
        :value="pickerViewData"
        indicator-style="height: 100rpx;"
        class="pickerView"
      >
        <picker-view-column>
          <view v-for="(hour, index) in hours" :key="index" class="pickerItem">
            {{ hour }}
          </view>
        </picker-view-column>
        <picker-view-column>
          <view class="pickerItem">
            ：
          </view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(minute, index) in minutes" :key="index" class="pickerItem">
            {{ minute }}
          </view>
        </picker-view-column>
      </picker-view>
      <view class="popupContainer ">
        <view class="flex justify-start">
          <button size="mini" @click="deleteDate(currentSelectedDate)">
            删除
          </button>
          <button size="mini" @click="addDate(currentSelectedDate)">
            确定
          </button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped>
.pickerView {
  width: 320rpx;
  height: 320rpx;
  margin-top: 30rpx;
  @apply text-center mx-auto;
}

.pickerItem {
  line-height: 60rpx;
  text-align: center;
  @apply text-center mx-auto;
}

.popupContainer {
  @apply px-2 py-6;
}
</style>
