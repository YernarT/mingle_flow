<template>
    <main class="database-page">
        <div class="card" @click="$router.push('/database/user')">
            <Icon name="material-symbols:person" />
            Қолданушылар
        </div>

        <div class="card" @click="$router.push('/database/cargo')">
            <Icon name="icon-park-outline:ad-product" />
            Заттар
        </div>
    </main>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.database-page {
    @include flex($gap: 24px, $wrap: wrap);

    .card {
        width: 285px;
        height: 140px;
        border-radius: var(--border-radius);
        border: 1px solid var(--c-border);
        cursor: pointer;
        @include flexCenter($gap: 8px);

        svg {
            @include svgStyle($size: 32px);
        }
    }
}
</style>
