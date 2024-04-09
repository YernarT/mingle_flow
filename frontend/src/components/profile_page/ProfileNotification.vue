<template>
  <div class="heading">
    <!-- <p>Сізде <strong>{{ notifications.length }}</strong> хабарландыру бар</p> -->
    <!-- <a-button :loading="loadingGetNotification" @click="getNotification">Жаңарту</a-button> -->
  </div>

  <ul class="notifications">
    <!-- <ForwardRequestCard v-for="notification in notifications" :key="notification.id" :forward-request="notification"
            @change="handleChangeFR" /> -->
  </ul>
</template>

<script setup lang="ts">
// Types
// import type { I_ForwardRequest } from "types/cargo";

// Hook
import useRequest from "vue-hooks-plus/es/useRequest";
// API
// import { API_GetNotification } from '~/service/api/cargo-api';
// Component
// import ForwardRequestCard from "~/components/cargo/ForwardRequestCard.vue";

defineOptions({ name: "ProfileNotification" });

// const notifications = ref<I_ForwardRequest[]>([]);

// const { run: getNotification, loading: loadingGetNotification } = useRequest(API_GetNotification, {
//     onSuccess({ data }) {
//         notifications.value = data;
//     }
// });

// const handleChangeFR = (fr: I_ForwardRequest) => {
//     notifications.value = notifications.value.map(notification => {
//         if (notification.id === fr.id) {
//             return fr;
//         }
//         return notification;
//     })
// }
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.heading {
  width: 100%;
  margin-bottom: 20px;
  @include flex($justifyContent: space-between, $alignItems: center);

  strong {
    font-weight: 500;
  }
}

.notifications {
  @include flex($direction: column, $gap: 20px);
}
</style>
