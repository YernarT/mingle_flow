<template>
    <main class="profile-page">
        <HeaderComp />

        <div class="itisit-container">
            <h3 class="title">Жеке кабинет</h3>
            <a-tabs v-model:activeKey="tab" :onChange="handleChangeTab">
                <a-tab-pane key="settings">
                    <template #tab>
                        <span>
                            <Icon name="material-symbols:settings-outline-rounded" />
                            Ақпарат
                        </span>
                    </template>
                    <ProfileSettings />
                </a-tab-pane>
                <a-tab-pane key="notification">
                    <template #tab>
                        <span>
                            <Icon name="material-symbols:notifications-outline" />
                            Хабарландыру
                        </span>
                    </template>
                    <ProfileNotification />
                </a-tab-pane>
            </a-tabs>
        </div>
    </main>
</template>
  
<script setup lang="ts">
// Router
import { useRoute, useRouter } from 'vue-router';
// Component
import HeaderComp from '@/components/common/HeaderComp.vue';
import ProfileSettings from '~/components/profile_page/ProfileSettings.vue';
import ProfileNotification from '~/components/profile_page/ProfileNotification.vue';

const route = useRoute();
const router = useRouter();

const tab = ref<string>(route.query.tab as string ?? 'settings');

watch(() => route.query.tab, () => {
    const quertTab = route.query.tab as string
    if (['settings', 'notification'].includes(quertTab)) {
        tab.value = quertTab;
    }
});

const handleChangeTab = (activeKey: 'settings' | 'notification') => {
    router.push({
        query: {
            ...route.query,
            tab: activeKey
        }
    });
};
</script>
  
<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.profile-page {
    .title {
        margin: 32px 0;
        font-size: 36px;
        color: var(--c-heading);
    }

    :deep(.ant-tabs) {
        width: 100%;

        .ant-tabs-tab-btn span {
            @include flex($alignItems: center, $gap: 8px);
        }
    }

    @media screen and (max-width: 576px) {
        .title {
            font-size: 24px;
            margin: 16px 0 10px;
        }

        :deep(.ant-tabs) {
            .ant-tabs-tab-btn span {
                font-size: 14px;
            }
        }
    }
}
</style>