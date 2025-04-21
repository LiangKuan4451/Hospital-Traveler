<script setup lang="ts">
import { usePageStore } from '@/stores/Pages'
import { onMounted, ref } from 'vue'

const nowDate = new Date()
const nowYear = nowDate.getFullYear()

const nowMonth = (nowDate.getMonth() + 1).toString().padStart(2, '0')
const nowHours = nowDate.getHours()
const nowMinutes = nowDate.getMinutes()

const accountData = ref<any>({})
const calendarData = ref()
const calendarPopupHospitalSelect = ref()
const calendarPopupDepartmentSelect = ref()

const currentYearPriceCount = ref<number>(0)
const currentMonthPriceCount = ref<number>(0)

function getLocalStorage() {
  try {
    usePageStore().getLocalStorage()

    accountData.value = usePageStore().accountRes.data
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

function sumDiaryPrice() {
  const years = accountData.value[nowYear]
  const months = accountData.value[nowYear]?.[nowMonth]
  console.log('months', months)

  Object.values(months).forEach((days: any) => {
    // console.log('days', days);

    days.time?.forEach((item: any) => {
      if (item.price) {
        currentMonthPriceCount.value += item.price
      }
    })
  })

  Object.values(years).forEach((months: any) => {
    Object.values(months).forEach((days: any) => {
    // console.log('days', days);

      days.time?.forEach((item: any) => {
        if (item.price) {
          currentYearPriceCount.value += item.price
        }
      })
    })
  })
}

onMounted(() => {
  getLocalStorage()
  sumDiaryPrice()
})
</script>

<template>
  <view>
    <!-- 状态栏占位符 -->
    <view class="status-bar" />
    <!-- 数据展示 -->
    <view class="summary-container">
      <!-- 年度累计就诊次数 -->
      <view class="summary-card">
        <view class="card-icon">
          <text class="i-mdi-calendar-check" />
        </view>
        <view class="card-content">
          <text class="card-label">年度累计</text>
          <text class="card-value">{{ accountData[nowYear]?.visitCount || 0 }}</text>
          <text class="card-unit">次</text>
        </view>
      </view>
      <!-- 本月累计就诊次数 -->
      <view class="summary-card">
        <view class="card-icon">
          <text class="i-mdi-calendar-month" />
        </view>
        <view class="card-content">
          <text class="card-label">本月累计</text>
          <text class="card-value">{{ accountData[nowYear]?.[nowMonth]?.visitCount || 0 }}</text>
          <text class="card-unit">次</text>
        </view>
      </view>
      <!-- 年度累计就诊金额 -->
      <view class="summary-card">
        <view class="card-icon">
          <text class="i-mdi-currency-jpy" />
        </view>
        <view class="card-content">
          <text class="card-label">年度金额</text>
          <text class="card-value">{{ currentYearPriceCount || 0 }}</text>
          <text class="card-unit">元</text>
        </view>
      </view>
      <!-- 本月累计就诊金额 -->
      <view class="summary-card">
        <view class="card-icon">
          <text class="i-mdi-cash" />
        </view>
        <view class="card-content">
          <text class="card-label">本月金额</text>
          <text class="card-value">{{ currentMonthPriceCount || 0 }}</text>
          <text class="card-unit">元</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.page-header {
  @apply px-4 py-3 bg-green-500 text-white;
}

.page-title {
  @apply text-lg font-bold;
}

.summary-container {
  @apply grid grid-cols-2 gap-4 px-4 py-5;
}

.summary-card {
  @apply flex p-4 rounded-lg shadow-md shadow-gray-400 bg-white border-l-4 border-l-green-400 relative overflow-hidden;
}

.card-icon {
  @apply absolute right-2 top-2 opacity-10 text-3xl;
}

.card-content {
  @apply flex flex-col;
}

.card-label {
  @apply text-sm text-gray-500 mb-1;
}

.card-value {
  @apply text-xl font-bold text-gray-800;
}

.card-unit {
  @apply text-xs text-gray-500 ml-1;
}

.chart-container {
  @apply mx-4 mt-4 mb-8 p-4 bg-white rounded-lg shadow-lg shadow-gray-400;
}

.chart-header {
  @apply border-b pb-2 mb-4;

  text {
    @apply font-bold text-gray-700;
  }
}

.chart-placeholder {
  @apply h-40 flex items-center justify-center border border-dashed border-gray-300 rounded-md;

  text {
    @apply text-gray-400;
  }
}
</style>
