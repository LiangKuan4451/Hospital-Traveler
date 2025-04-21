<script setup lang="ts">
onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
@use 'tailwindcss/base';
@use 'tailwindcss/components';
@use 'tailwindcss/utilities';

body {
  @apply bg-green-100;
}

.status-bar {
  height: var(--status-bar-height);
  width: 100%;
}

:deep(.uni-section-header) {
  @apply text-sm px-4 !important;
}

:deep(.uni-calendar-item--extra) {
  @apply text-green-500 !important;
}

:deep(.uni-section-header__decoration) {
  @apply bg-green-500 !important;
}

:deep(.uni-calendar-item__weeks-box-circle) {
  @apply bg-green-500 !important;
}

:deep(.uni-calendar-item--checked) {
  @apply rounded-sm !important;
}

:deep(.uni-calendar-item--isDay) {
  @apply rounded-sm !important;
}

/*  #ifdef  H5  */
svg {
  display: initial;
}

/*  #endif  */

@layer components {
  .raw-btn {
    // 注意 after: 后面不能加任何空格，有些格式化工具可能会在这里自动加一个空格
    @apply after:border-none inline-flex items-center gap-2 rounded text-sm font-semibold transition-all;
  }

  .btn {
    // 使用上面定义的 raw-btn
    @apply raw-btn bg-gradient-to-r from-[#9e58e9] to-blue-500 px-2 py-1 text-white;
  }
}
</style>
