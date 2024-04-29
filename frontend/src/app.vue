<template>
  <Html lang="kk">
    <Head>
      <Meta charset="UTF-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <Meta name="theme-color" content="rgb(255, 66, 122)" />
      <meta name="color-scheme" content="light" />

      <Meta httpEquiv="x-ua-compatible" content="IE=edge" />
      <Meta httpEquiv="x-ua-compatible" content="IE=7" />

      <Meta
        name="description"
        content="Тапсырмаларды, прогресті ұйымдастыруға арналған жобаларды тиімді басқару жүйесі. Жұмыс процестерін оңтайландырып, ынтымақтастықты жақсартып және өнімділікті арттырады."
      />
      <Meta
        name="keywords"
        content="жобаны басқару, тапсырмаларды ұйымдастыру, топтық ынтымақтастық, жұмыс процесін оңтайландыру, өнімділік"
      />
      <Meta name="author" content="https://github.com/YernarT" />

      <Meta property="og:title" content="Mingle Flow" />
      <Meta
        property="og:description"
        content="Тапсырмаларды, прогресті ұйымдастыруға арналған жобаларды тиімді басқару жүйесі. Жұмыс процестерін оңтайландырып, ынтымақтастықты жақсартып және өнімділікті арттырады."
      />
      <Meta property="og:image" content="/favicon.ico" />
      <Meta property="og:site_name" content="Mingle Flow" />
      <Meta property="og:type" content="website" />
      <Meta property="og:locale" content="kk_KZ" />

      <Link rel="icon" href="/favicon.ico" />

      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500&display=swap"
        rel="stylesheet"
      />

      <Title>Mingle Flow</Title>
    </Head>

    <Body>
      <NuxtLayout>
        <a-config-provider :locale="kk_KZ" :theme="ANTD_THEME">
          <NuxtPage />
        </a-config-provider>
      </NuxtLayout>
    </Body>
  </Html>
</template>

<script setup lang="ts">
// Vue
import { onBeforeMount } from "vue";
// Store
import { useUserStore } from "@/stores/user";
// Antd
import kk_KZ from "ant-design-vue/locale/kk_KZ";
import { ANTD_THEME } from "@/constants/antd";

// 初始化 Store
onBeforeMount(() => {
  const userStore = useUserStore();
  userStore.initUserFromLocal();
});
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity var(--transition), filter var(--transition);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(2px);
}
</style>
