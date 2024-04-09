<template>
  <section class="design-section">
    <img class="design" src="/image/index_page_design.png" alt="Design" />
  </section>
</template>

<script setup lang="ts">
// Vue
import { defineOptions } from "vue";

defineOptions({ name: "DesignSection" });
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.design-section {
  margin-top: 60px;
  padding: 0 16px;
  position: relative;
  z-index: 2;

  .design {
    display: block;
    width: 80%;
    max-width: 1030px;
    margin: 0 auto;
    border-radius: var(--border-radius);
    box-shadow: rgba(255, 66, 122, 0.2) 0 2px 8px 0;
  }

  @media screen and (max-width: 576px) {
    margin-top: 40px;

    .design {
      width: 100%;
    }
  }
}
</style>
