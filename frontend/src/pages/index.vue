<template>
  <main class="index-page">
    <HeaderComp />
    <MainSection />
    <DesignSection />
    <FooterComp />
  </main>
</template>

<script setup lang="ts">
// Vue
import { defineOptions } from "vue";

// Component
import HeaderComp from "@/components/common/HeaderComp.vue";
import MainSection from "@/components/index_page/MainSection.vue";
import DesignSection from "@/components/index_page/DesignSection.vue";
import FooterComp from "@/components/index_page/FooterComp.vue";

defineOptions({ name: "IndexPage" });
</script>
