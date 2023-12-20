<template>
    <header class="itisit-container header">
        <div class="logo">
            <img src="~/assets/image/logo.png" alt="Mingle Flow">
            <span>Mingle Flow</span>
        </div>
    </header>
</template>

<script setup lang="ts">
// Vue
import { defineComponent } from 'vue';

defineComponent({ name: 'HeaderComp' });
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.header {
    height: 64px;
    @include flex($alignItems: center);

    .logo {
        @include flex($alignItems: center, $gap: 8px);

        img {
            width: 34px;
            height: 34px;
            object-fit: cover;
        }

        span {
            font-weight: 500;
        }
    }
}
</style>