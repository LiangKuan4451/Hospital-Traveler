<script setup lang="ts">
import { onMounted, ref } from 'vue'

const calendar = ref({
  cale: {
    date: null,
  },
})
const calendarData = ref<any[]>([])
const calendarPopup = ref()
const calendarRefData = ref<any>()
const calendarPopupInput = ref()
const currentSelectedDate = ref<any>()

const accountData = ref<any>({})

const nowDate = new Date()
const nowHours = nowDate.getHours()
const nowMinutes = nowDate.getMinutes()

const hours = ref(Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')))
const minutes = ref(Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')))

const pickerMid = ref({
  0: ':',
})
const pickerViewData = ref([nowHours, pickerMid.value[0], nowMinutes])
const pickerData = ref()

const message = ref()
const messageText = ref()

const table = ref()
const tableThOption = ref([
  { title: '医院' },
  { title: '时间' },
  { title: '选项' },
])

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

  console.log('Parsed dateData:', { year, month, fulldate, day })
  console.log('Current accountData:', accountData.value)

  if (!year || !month || !day) {
    console.error('Invalid dateData:', { year, month, day })
    return
  }

  if (!accountData.value[year]) {
    accountData.value[year] = { visitCount: 0 }
  }
  if (!accountData.value[year][month]) {
    accountData.value[year][month] = { visitCount: 0 }
  }
  if (!accountData.value[year][month][day]) {
    accountData.value[year][month][day] = { visitCount: 0, time: [] }
  }
  if (!accountData.value[year][month][day]?.time?.some((item: any) => item.time === pickerData.value.join(''))) {
    accountData.value[year].visitCount++
    accountData.value[year][month].visitCount++
    accountData.value[year][month][day].visitCount++
    accountData.value[year][month][day].time.push({ time: pickerData.value.join(''), hospitalInfo: calendarPopupInput.value })
  }
  else {
    togglePopup(message, true)
    messageText.value = '已经有相同时间了！'
    return
  }

  if (!calendarData.value.find((item: any) => item.date === fulldate)) {
    calendarData.value.push({ date: fulldate, info: `${accountData.value[year][month][day].visitCount} 次` })
  }
  else {
    calendarData.value = calendarData.value.map((item: any) => {
      if (item.date === fulldate) {
        item.info = `${accountData.value[year][month][day].visitCount} 次`
      }
      return item
    })
  }
  console.log('Updated accountData:', accountData.value[year])

  setLocalStorage()
}

function deleteDate(dateData: any, index: number) {
  const { year, month, fulldate, date: day } = isVueRef(dateData) ? dateData.value : dateData

  // 删除 calendarData 中的数据
  calendarData.value = calendarData.value.filter((item: any) => item.date !== fulldate)

  // 删除 accountData 中的数据
  if (accountData.value[year] && accountData.value[year][month]) {
    if (accountData.value[year][month][day]) {
      accountData.value[year].visitCount--
      accountData.value[year][month].visitCount--
      accountData.value[year][month][day].visitCount--
      accountData.value[year][month][day].time.splice(index, 1)
    }
  }
  if (accountData.value[year][month][day].time.length !== 0) {
    calendarData.value.push({ date: fulldate, info: `${accountData.value[year][month][day].visitCount} 次` })
  }
  togglePopup(calendarPopup, false)
  setLocalStorage()
}

function pickerChange(e: any) {
  // console.log(pickerViewData.value)

  pickerData.value = e.detail.value
  pickerData.value[0] = pickerData.value[0]?.toString()
  pickerData.value[1] = ':'
  pickerData.value[2] = pickerData.value[2]?.toString().padStart(2, '0')
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

// watch(
//   () => calendar.value?.cale?.selectDate,
//   (newVal) => {
//     console.log('calendarRefData', newVal)
//     calendarRefData.value = newVal
//   },
//   { deep: true },
// )

onMounted(() => {
  loadStorageData()
  currentSelectedDate.value = calendar.value?.cale?.selectDate
  currentSelectedDate.value.fulldate = currentSelectedDate.value.fullDate
  delete currentSelectedDate.value.fullDate
  pickerData.value = pickerViewData.value
  // 手动触发 watch 函数
  setInterval(() => {
    calendarRefData.value = calendar.value?.cale?.selectDate
  }, 200)
})
</script>

<template>
  <view>
    <!-- 日历 -->
    <uni-calendar ref="calendar" :selected="calendarData" @change="selecteDate" />
    <!-- 今日次数 -->
    <uni-section title="今日次数" type="line" />
    <!-- 表格 -->
    <uni-table ref="table" border stripe emptyText="暂无更多数据">
      <uni-tr>
        <uni-th v-for="(item, index) in tableThOption" :key="index" :width="index === 2 ? '90px' : 'auto'" align="center">
          {{ item.title }}
        </uni-th>
      </uni-tr>
      <uni-tr v-for="(item, index) in accountData[currentSelectedDate?.year]?.[currentSelectedDate?.month]?.[currentSelectedDate?.date]?.time" :key="index">
        <uni-td class="text-center">
          {{ item.hospitalInfo }}
        </uni-td>
        <uni-td class="text-center">
          {{ item.time }}
        </uni-td>
        <uni-td>
          <button class="mx-auto" plain size="mini" type="warn" @click="deleteDate(currentSelectedDate, index)">
            删除
          </button>
        </uni-td>
      </uni-tr>
    </uni-table>
    <!-- 数据累计 -->
    <uni-section title="数据累计" type="line" />
    <view class="flex place-content-center pb-10 pt-5 text-center">
      <view class="date-total">
        <view id="monthTotal">
          {{ accountData[calendarRefData?.year]?.[calendarRefData?.month]?.visitCount || 0 }}
        </view>
        <text>月累计</text>
      </view>
      <view class="date-total">
        <view id="yaerTotal">
          {{ accountData[calendarRefData?.year]?.visitCount || 0 }}
        </view>
        <text class="">年累计</text>
      </view>
    </view>
    <!-- 添加日期弹出框 -->
    <uni-popup
      ref="calendarPopup"
      type="bottom"
      background-color="#fff"
      borderRadius="20px 20px 0 0"
      immediate-change="false"
    >
      <uni-section title="医院" type="line" />
      <view class="mx-auto w-4/5">
        <input
          v-model="calendarPopupInput"
          placeholder="输入医院名称、科室"
          placeholder-class="input-placeholder"
          class="focus:border focus:border-lime-500"
        >
      </view>
      <!-- 日期选择器 -->
      <uni-section title="日期" type="line" />
      <picker-view
        :value="pickerViewData"
        indicator-style="height: 100rpx;"
        class="picker-view"
        @change="pickerChange"
      >
        <picker-view-column>
          <view v-for="(hour, index) in hours" :key="index" class="picker-item">
            {{ hour }}
          </view>
        </picker-view-column>
        <picker-view-column>
          <view class="picker-item">
            :
          </view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(minute, index) in minutes" :key="index" class="picker-item">
            {{ minute }}
          </view>
        </picker-view-column>
      </picker-view>
      <view class="mx-auto w-1/3 pb-4 pt-6 text-center">
        <button class="mx-auto" plain size="mini" @click="addDate(currentSelectedDate)">
          确定
        </button>
      </view>
    </uni-popup>
    <!-- 提示信息弹窗 -->
    <uni-popup ref="message" type="message">
      <uni-popup-message type="warn" :message="messageText" :duration="2000" />
    </uni-popup>
  </view>
</template>

<style scoped>
.picker-view {
  width: 320rpx;
  height: 320rpx;
  margin-top: 30rpx;
  @apply text-center mx-auto;
}

.picker-item {
  line-height: 60rpx;
  text-align: center;
  @apply text-center mx-auto;
}

.popup-container {
  @apply px-2 py-6;
}
.date-total {
  @apply m-auto w-20 rounded-md py-2 shadow-sm ring-2 ring-lime-500;
  text {
    @apply overline decoration-lime-500;
  }
}

:deep(.uni-popup__wrapper) {
  @apply pt-5 !important;
}

:deep(.uni-calendar-item--extra) {
  @apply text-lime-500 !important;
}

:deep(.uni-section-header__decoration) {
  @apply bg-lime-500 !important;
}

:deep(.uni-calendar-item__weeks-box-circle) {
  @apply bg-lime-500 !important;
}

:deep(.uni-calendar-item--isDay) {
  @apply bg-sky-500 !important;
}

:deep(.uni-table-td) {
  @apply align-middle text-center !important;
}
</style>
