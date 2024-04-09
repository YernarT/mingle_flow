<template>
  <div class="status" :class="[`status--${status}`]">
    {{ statusLabel }}
  </div>
</template>

<script setup lang="ts">
// Types
import type { T_ProjectStatus } from "@/types/project";

// Vue
import { computed } from "vue";

defineOptions({ name: "ProjectStatus" });

const props = defineProps<{ status: T_ProjectStatus }>();

const statusLabel = computed(() => {
  switch (props.status) {
    case 0:
      return "Жоспарлауда";
    case 1:
      return "Орындалуда";
    case 2:
      return "Күтуде";
    case 3:
      return "Аяқталған";
  }
});
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.status {
  font-size: 16px;
  color: var(--status-color);
  @include flex($alignItems: center, $gap: 6px);

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--status-color);
  }

  &--0 {
    --status-color: var(--c-primary);
  }
  &--1 {
    --status-color: var(--c-success);
  }
  &--2 {
    --status-color: var(--c-warning);
  }
  &--3 {
    --status-color: var(--c-error);
  }
}
</style>
