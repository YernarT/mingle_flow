<template>
    <div class="project-card">
        <div class="head">
            <div class="col">
                <h3 class="name">Astana Hub</h3>
                <div class="status"></div>
            </div>
            <div class="row">
                <Icon name="material-symbols:edit" />
                <Icon name="mdi:dots-vertical" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Vue
import { defineComponent } from 'vue';
// Component


defineComponent({ name: 'ProjectCard' });

</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.project-card {
    border-radius: var(--border-radius);
    background-color: #fff;
    transition: box-shadow var(--transition);

    .head {
        @include flex($justifyContent: space-between);

        .row {
            @include flex($alignItems: center, $gap: 16px);
        }

        .col {
            @include flex($direction: column, $gap: 16px);
        }
    }

    &:hover {
        box-shadow: 0 3px 36px 12px rgba(80, 126, 169, 0.12);
    }
}
</style>