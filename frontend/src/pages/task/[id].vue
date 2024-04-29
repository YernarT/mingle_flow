<template>
  <main class="task-detail-page">
    Task detail page
    {{ $route.params.id }}
  </main>
</template>

<script setup>
defineOptions({ name: "TaskDetailPage" });
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.task-detail-page {
}
</style>
