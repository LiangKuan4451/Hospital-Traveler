import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', () => {
  const calendarRes = ref()
  const accountRes = ref()
  const hospitalRes = ref()
  const departmentRes = ref()

  async function getLocalStorage() {
    try {
      calendarRes.value = await uni.getStorage({ key: 'calendarData' })
      accountRes.value = await uni.getStorage({ key: 'accountData' })
      hospitalRes.value = await uni.getStorage({ key: 'hospitals' })
      departmentRes.value = await uni.getStorage({ key: 'departments' })
    }
    catch (error) {
      console.error('没有数据：', error)
    }
  }

  function reloadPage() {
    uni.reLaunch({
      url: '/pages/index/index',
    })
  }

  function clearStorage() {
    const storageTasks = [
      uni.removeStorage({ key: 'calendarData' }),
      uni.removeStorage({ key: 'accountData' }),
      uni.removeStorage({ key: 'hospitals' }),
      uni.removeStorage({ key: 'departments' }),
    ]
    calendarRes.value = {}
    accountRes.value = {}
    hospitalRes.value = []
    departmentRes.value = []

    Promise.all(storageTasks).then(() => {
      console.log('Storage cleared successfully')

      reloadPage()
    })
  }

  function setLocalStorage(calendarData, accountData, hospitalRes, departmentRes) {
    const storageTasks = [
      uni.setStorage({ key: 'calendarData', data: calendarData }),
      uni.setStorage({ key: 'accountData', data: accountData }),
      uni.setStorage({ key: 'hospitals', data: departmentRes }),
      uni.setStorage({ key: 'departments', data: hospitalRes }),
    ]

    Promise.all(storageTasks)
      .then(() => {
        console.log('Storage saved successfully')
        usePageStore().reloadPage()
      })
      .catch((error) => {
        console.error('Failed to save storage:', error)
      })
  }

  return { reloadPage, clearStorage, setLocalStorage, getLocalStorage, calendarRes, accountRes, hospitalRes, departmentRes }
})
