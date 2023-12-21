<template>
    <div class="auth-template">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
        <div class="circle-3"></div>
        <div class="circle-4"></div>

        <div class="form-wrap">
            <h3 class="title">
                Mingle Flow
                <br />
                Қош келдіңіз
            </h3>
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts" />

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.auth-template {
    --c-border: rgb(39, 40, 53);

    width: 100%;
    min-height: 100dvh;
    overflow: hidden;
    background-color: rgb(25, 26, 35);
    position: relative;

    .form-wrap {
        color: rgb(194, 202, 209);
        padding: 44px;
        padding-bottom: 56px;
        border-radius: var(--border-radius);
        border: 1px solid var(--c-border);
        background-color: rgb(25, 26, 35);
        @include positionCenter;

        .title {
            font-size: 28px;
            text-align: center;
            margin-bottom: 24px;
        }
    }

    [class^="circle"] {
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        border: 1px solid var(--c-border);
        @include positionCenter;
    }

    .circle-1 {
        --size: 555px;
        opacity: 0.95;
    }

    .circle-2 {
        --size: 675px;
        opacity: 0.75;
    }

    .circle-3 {
        --size: 795px;
        opacity: 0.55;
    }

    .circle-4 {
        --size: 920px;
        opacity: 0.4;
    }

    /* Responsive */
    @media screen and (max-width: 576px) {
        .form-wrap {
            width: calc(100% - 32px);
            padding: 20px 16px;
            padding-bottom: 24px;

            .title {
                font-size: 22px;
            }
        }
    }
}
</style>