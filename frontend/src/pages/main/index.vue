<template>
    <main class="main-page">
        <HeaderComp />

        <div class="itisit-container actions">
            <a-button class="add-prj-btn" type="primary">
                <Icon name="material-symbols:add-rounded" />
                Жаңа жоба
            </a-button>

            <FilterSort />
        </div>
    </main>
</template>

<script setup lang="ts">
// Vue
import { defineComponent } from 'vue';
// Component
import HeaderComp from '@/components/common/HeaderComp.vue';
import FilterSort from '@/components/main_page/FilterSort.vue';

defineComponent({ name: 'MainPage' });

</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.actions {
    margin-top: 32px;
    @include flex($alignItems: center, $gap: 24px);

    .add-prj-btn {
        height: 44px;
        border-radius: 26px;
    }
}
</style>