<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import { computed, onMounted, ref } from 'vue'

const calendar = ref({
  cale: {
    date: null,
  },
})

const calendarData = ref([])
const calendarPopup = ref()

const currentSelectedDate = ref<any>()
const calendarSelectMode = (false)

const calendarPopupHospitalInput = ref()
const calendarPopupHospitalSelect = ref([])

const calendarPopupPriceInput = ref()

const calendarPopupDepartmentInput = ref()
const calendarPopupDepartmentSelect = ref([])

const calendarPopupDiaryInput = ref()

const accountData = ref<any>({})

const nowDate = new Date()
const nowHours = nowDate.getHours().toString().padStart(2, '0')
const nowMinutes = nowDate.getMinutes().toString().padStart(2, '0')

const hours = ref(Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')))
const minutes = ref(Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')))

const pickerMid = ref({
  0: ':',
})
const pickerViewData = ref([nowHours, pickerMid.value[0], nowMinutes])
const pickerData = ref()

const message = ref()
const messageText = ref()

const deleteDiaryPopup = ref()
const deleteDiaryDialog = ref()

const cardDiaryData = ref()
const cardDiaryDataIndex = ref()

const table = ref()
const tableThOption = ref([
  { title: '医院' },
  { title: '科室' },
  { title: '时间' },
  { title: '日记' },
  { title: '选项' },
])

function isVueRef(ref: any): ref is { value: any } {
  return typeof ref === 'object' && 'value' in ref
}

function initRef() {
  cardDiaryData.value = null
  cardDiaryDataIndex.value = null
  calendarPopupHospitalInput.value = null
  calendarPopupDepartmentInput.value = null
  calendarPopupDiaryInput.value = null
  calendarPopupPriceInput.value = null
  pickerData.value = [nowHours, pickerMid.value[0], nowMinutes]
  pickerViewData.value = [nowHours, pickerMid.value[0], nowMinutes]
}

function togglePopup(ref: any, isOpen: boolean, diaryData: any, diaryDataIndex: number) {
  if (!ref) { return }
  const popup = isVueRef(ref) ? ref.value : ref // 统一处理 ref

  if (isOpen) {
    if (diaryData) {
      console.log('diaryData', diaryData)
      cardDiaryData.value = diaryData
      cardDiaryDataIndex.value = diaryDataIndex
      calendarPopupHospitalInput.value = diaryData.hospitalName
      calendarPopupDepartmentInput.value = diaryData.departmentName
      calendarPopupDiaryInput.value = diaryData.diary
      calendarPopupPriceInput.value = diaryData.price
      pickerData.value = diaryData.time !== undefined ? [diaryData.time.toString().slice(0, 2), pickerMid.value[0], diaryData.time.toString().slice(3)] : [nowHours, pickerMid.value[0], nowMinutes]
      pickerViewData.value = diaryData.time !== undefined ? [diaryData.time.toString().slice(0, 2), pickerMid.value[0], diaryData.time.toString().slice(3)] : [nowHours, pickerMid.value[0], nowMinutes]
    }
    popup.open()
  }
  else {
    popup.close()
    initRef()
  }
}

function setLocalStorage() {
  usePageStore().setLocalStorage(calendarData.value, accountData.value, calendarPopupDepartmentSelect.value, calendarPopupHospitalSelect.value)
}

function selecteDate(dateData: any) {
  // console.log(timePicker)
  console.log('dateData', dateData)
  console.log('calendar.value.cale.date', calendar.value)

  currentSelectedDate.value = dateData

  // console.log(calendar.value)
  if (calendarSelectMode) {
    togglePopup(calendarPopup, true)
  }
}

async function getLocalStorage() {
  try {
    await usePageStore().getLocalStorage()

    accountData.value = usePageStore().accountRes.data || {}
    calendarData.value = usePageStore().calendarRes.data || []
    calendarPopupHospitalSelect.value = usePageStore().hospitalSelectRes.data || []
    calendarPopupDepartmentSelect.value = usePageStore().departmentRes.data || []
    console.log(accountData.value)
  }
  catch (error) {
    console.error('没有数据：', error)
    calendarData.value = [] // 设置默认值
    accountData.value = {} // 设置默认值
  }
}

function addDiaryDate(dateData: any) {
  console.log('addDiaryDate', dateData)

  const { year, month, fulldate, date: day } = isVueRef(dateData) ? dateData.value : dateData
  // 将属性类型保持一致
  // 因为calendar里cale和calendar的date是不同的类型
  day?.toString().padStart(2, '0')

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
    // 计算访问次数
    accountData.value[year].visitCount++
    accountData.value[year][month].visitCount++
    accountData.value[year][month][day].visitCount++
    const diaryData = { time: pickerData.value.join(''), hospitalName: calendarPopupHospitalInput.value, departmentName: calendarPopupDepartmentInput.value, diary: calendarPopupDiaryInput.value, price: Number.parseInt(calendarPopupPriceInput.value) }
    accountData.value[year][month][day].time.push(diaryData)
    // 添加医院和科室到选择列表
    if (!calendarPopupDepartmentSelect.value.includes(calendarPopupDepartmentInput.value)) {
      calendarPopupDepartmentSelect.value.push(calendarPopupDepartmentInput.value)
    }
    if (!calendarPopupHospitalSelect.value.includes(calendarPopupHospitalInput.value)) {
      calendarPopupHospitalSelect.value.push(calendarPopupHospitalInput.value)
    }
    togglePopup(calendarPopup, false)
  }
  else {
    const diaryData = { time: pickerData.value.join(''), hospitalName: calendarPopupHospitalInput.value, departmentName: calendarPopupDepartmentInput.value, diary: calendarPopupDiaryInput.value, price: calendarPopupPriceInput.value }

    accountData.value[year][month][day].time.forEach((element, index) => {
      if (element.time === diaryData.time) {
        accountData.value[year][month][day].time[index] = diaryData
      }
    })

    togglePopup(calendarPopup, false)
  }
  // 修改打卡数据
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

async function deleteDiaryDate(dateData: any, index: number) {
  console.log('deleteDiaryDate', dateData)
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
  // console.log('pickerData', pickerData.value)
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
  getLocalStorage()
  currentSelectedDate.value = calendar.value?.cale?.selectDate
  currentSelectedDate.value.date = calendar.value?.calendar?.date
  currentSelectedDate.value.fulldate = currentSelectedDate.value.fullDate
  delete currentSelectedDate.value.fullDate
  pickerData.value = pickerViewData.value
  console.log('calendar', calendar.value)

  console.log('currentSelectedDate', currentSelectedDate.value)
})
</script>

<template>
  <view>
    <!-- 状态栏占位符 -->
    <view class="status-bar" />
    <!-- 日历 -->
    <view class="border-b border-solid border-gray-200">
      <uni-calendar ref="calendar" :selected="calendarData" @change="selecteDate" />
    </view>
    <!-- 今日次数 -->
    <uni-section title="今日访问" type="line" />
    <!-- 卡片展示 -->
    <uni-card
      v-for="(item, index) in accountData[currentSelectedDate?.year]?.[currentSelectedDate?.month]?.[currentSelectedDate?.date]?.time"
      :key="index" :title="item.hospitalName" :sub-title="item.departmentName" class="relative"
    >
      <text class="uni-body">{{ item.diary }}</text>
      <!-- 数据标签 -->
      <view class="absolute right-6 top-2 grid grid-cols-2 gap-y-1">
        <view class="diary-tag ">
          <text class="i-mdi-clock-outline align-middle" />
          <text class="align-middle">{{ item.time }}</text>
        </view>
        <view class="diary-tag">
          <text class="i-mdi-currency-jpy align-middle" />
          <text class="align-middle">{{ item.price || 0 }}</text>
        </view>
        <!-- 编辑选项 -->
        <view class="diary-option">
          <text class=" text-blue-400" @click="togglePopup(calendarPopup, true, item, index)">
            编辑
          </text>
        </view>
        <view class="diary-option">
          <text class=" text-red-500" @click="togglePopup(deleteDiaryPopup, true, currentSelectedDate, index)">
            删除
          </text>
        </view>
      </view>
    </uni-card>
    <!-- 表格 -->
    <!--
      <uni-table ref="table" border stripe emptyText="暂无数据">
        <uni-tr>
          <uni-th
            v-for="(thItem, thIndex) in tableThOption" :key="thIndex" align="center"
            :width="uniThWidth(thIndex)"
          >
            {{ thItem.title }}
          </uni-th>
        </uni-tr>
        <uni-tr
          v-for="(trItem, trIndex) in accountData[currentSelectedDate?.year]?.[currentSelectedDate?.month]?.[currentSelectedDate?.date]?.time"
          :key="trIndex" @click="deleteDiaryDate(currentSelectedDate, trIndex)
          "
        >
          <uni-td>
            {{ trItem.hospitalName }}
          </uni-td>
          <uni-td>
            {{ trItem.departmentName }}
          </uni-td>
          <uni-td>
            {{ trItem.time }}
          </uni-td>
          <uni-td>
            <button class="tableButton" plain size="mini" type="primary">
              查看
            </button>
          </uni-td>
          <uni-td>
            <button class="tableButton" plain size="mini" type="warn" @click="deleteDiaryDate(currentSelectedDate, trIndex)">
              删除
            </button>
          </uni-td>
        </uni-tr>
      </uni-table> -->
    <!-- 添加日记弹出框 -->
    <uni-popup
      ref="calendarPopup" type="bottom" background-color="#fff" borderRadius="20px 20px 0 0"
      immediate-change="false"
    >
      <!-- 医院输入框 -->
      <uni-section type="line" title="医院名称">
        <view class="relative mx-auto w-4/5">
          <uni-combox
            v-model="calendarPopupHospitalInput" :candidates="calendarPopupHospitalSelect"
            placeholder="请输入名称"
          />
        </view>
      </uni-section>
      <!-- 科室输入框 -->
      <uni-section type="line" title="科室名称">
        <view class="relative mx-auto w-4/5">
          <uni-combox
            v-model="calendarPopupDepartmentInput" :candidates="calendarPopupDepartmentSelect"
            placeholder="请输入名称"
          />
        </view>
      </uni-section>
      <!-- 记录文本框 -->
      <uni-section type="line" title="记录">
        <view class="relative mx-auto w-4/5">
          <uni-easyinput v-model="calendarPopupDiaryInput" type="textarea" placeholder="" />
        </view>
      </uni-section>
      <!-- 金额输入框 -->
      <uni-section type="line" title="金额">
        <view class="relative mx-auto w-4/5">
          <uni-easyinput v-model="calendarPopupPriceInput" type="number" placeholder="输入金额" />
        </view>
      </uni-section>
      <!-- 图片选择器 -->
      <!-- <uni-section type="line" title="图片">
        <view class="relative mx-auto w-4/5 py-1">
          <button>
            <span class="i-mdi-plus" />
          </button>
          <view class="size-16">
            <image mode="scaleToFill" class="block max-h-full max-w-full" src="@/static/img/mdi--account-active.png" alt="" />
          </view>
        </view>
      </uni-section> -->
      <!-- 日期选择器 -->
      <uni-section title="日期" type="line" />
      <picker-view :value="pickerViewData" indicator-style="height: 50rpx;" class="picker-view" @change="pickerChange">
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
      <view class="mx-auto flex w-2/3 pb-4 pt-6 text-center ">
        <button class="mx-auto" plain size="mini" @click="togglePopup(calendarPopup, false)">
          取消
        </button>
        <button class="mx-auto" plain size="mini" @click="addDiaryDate(currentSelectedDate)">
          确定
        </button>
      </view>
    </uni-popup>
    <!-- 删除弹出框 -->
    <uni-popup ref="deleteDiaryPopup" type="dialog">
      <uni-popup-dialog
        ref="deleteDiaryDialog" type="warn" cancelText="取消" confirmText="确认" title="通知"
        content="确定删除所选日记吗？" @confirm="deleteDiaryDate(cardDiaryData, cardDiaryDataIndex)"
        @close="togglePopup(deleteDiaryPopup, false)"
      />
    </uni-popup>
    <!-- 提示信息弹窗 -->
    <uni-popup ref="message" type="message">
      <uni-popup-message type="warn" :message="messageText" :duration="2000" />
    </uni-popup>
    <view>
      <uni-fab
        :pattern="{
          buttonColor: '#22c55e',
        }" horizontal="right" vertical="bottom" :popMenu="false" @fabClick="togglePopup(calendarPopup, true)"
      />
    </view>
  </view>
</template>

<style scoped>
.picker-view {
  width: 500rpx;
  height: 220rpx;
  @apply text-center mx-auto;
}

.picker-item {
  text-align: center;
  @apply text-center mx-auto;
}

.popup-container {
  @apply px-2 py-6;
}

.date-total {
  @apply m-auto w-20 rounded-md py-2 shadow-sm shadow-gray-400 ring-2 ring-green-500;

  text {
    @apply overline decoration-green-500;
  }
}

:deep(.uni-popup__wrapper) {
  @apply pt-5 !important;
}

:deep(.uni-calendar-item--isDay) {
  @apply !important;
}

:deep(.uni-table-td) {
  @apply align-middle text-center !important;
}

:deep(.tableButton) {
  @apply px-2 !important;
}

input {
  @apply focus:border focus:border-green-500;
}

:deep(.uni-card--border) {
  @apply border-l-[6rpx] border-l-green-400 rounded-md border-gray-300 !important;
}

:deep(.uni-card__header-content-subtitle) {
  @apply text-sm text-gray-600 !important;
}

.diary-tag {
  @apply w-full align-middle text-sm text-right;

  :nth-child(1) {
    @apply text-base;
  }

  text {
    @apply mx-[2rpx];
  }
}

.diary-option {
  @apply text-sm text-right;
}

:deep(.uni-combox__selector) {
  @apply z-50 !important;
}
</style>
