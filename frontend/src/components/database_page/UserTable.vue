<template>
    <div ref="$userTable" class="user-table" :class="{ 'user-table--loading': loading }">
        <div class="head">
            <div v-for="th in userTableHeads" :key="th.dataIndex" class="th" :class="th.dataIndex">
                <a-checkbox v-if="th.dataIndex === 'id'" />
                <span v-else>{{ th.title }}</span>
            </div>

        </div>

        <div class="body">
            <div v-for="data in dataSource" :key="data.id" class="row">
                <!-- @vue-skip -->
                <UserTableCell v-for="th in userTableHeads" :key="data.id + th.dataIndex" :user="data" :th="th"
                    @delete="$user => $emit('delete', $user)" />
            </div>

            <a-empty v-if="!loading && dataSource.length === 0">
                <template #image>
                    <Icon name="noto:smiling-face-with-open-mouth-and-cold-sweat" />
                </template>
            </a-empty>
        </div>
    </div>

    <a-spin :class="{ 'loading': loading }" />
</template>

<script setup lang="ts">
// Types
import type { I_User } from '~/types/user';

// 常量
import { userTableHeads } from '~/constants/table';
// Component
import UserTableCell from './UserTableCell.vue';

defineEmits<{
    (e: 'delete', user: I_User): void
}>();

const props = defineProps({
    dataSource: {
        type: Object as PropType<(I_User & { checked: boolean })[]>,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const { dataSource, loading } = toRefs(props);

</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.user-table {
    width: 100%;
    height: 100%;
    overflow: auto;
    border-radius: var(--border-radius);
    border: 1px solid var(--c-border);
    position: relative;
    transition: opacity var(--transition);

    .head {
        width: 100%;
        border-radius: inherit;
        cursor: default;
        @include flex;

        .th {
            height: 60px;
            padding: 16px;
            background-color: rgb(250, 250, 250);
            @include flex($alignItems: center);

            &:not(:last-child) {
                border-right: 1px solid var(--c-border);
            }

            span {
                font-weight: 500;
            }

            &.id {
                width: 48px;
                flex: 0 0 48px;
            }

            &.phone {
                width: 132px;
                flex: 0 0 132px;
            }

            &.fullname {
                width: 120px;
                flex: 1 0 120px;
            }

            &.role {
                width: 70px;
                flex: 0 0 70px;
            }

            &.createTime {
                width: 191px;
                flex: 0 0 191px;
            }

            &.action {
                width: 124px;
                flex: 0 0 124px;
            }
        }
    }

    .body {
        @include flex($direction: column);

        .row {
            width: 100%;
            @include flex;

            &:last-child {
                .cell {
                    border-bottom: none;
                }
            }
        }

        :deep(.ant-empty) {
            @include positionCenter;

            .ant-empty-image {
                height: auto;
                margin: 0;

                svg {
                    @include svgStyle($size: 64px, $color: transparent);

                    @media screen and (max-width: 576px) {
                        @include svgStyle($size: 40px, $color: transparent);
                    }
                }
            }
        }
    }

    &--loading {
        opacity: 0.25;
        pointer-events: none;
    }
}

.ant-spin {
    opacity: 0;
    transition: opacity var(--transition);
    pointer-events: none;
    transform: translate(-50%, 100%);
    @include positioned($bottom: 50%, $left: 50%);

    :deep(.ant-spin-dot) {
        width: 50px;
        height: 50px;

        .ant-spin-dot-item {
            width: 22px;
            height: 22px;
        }
    }

    &.loading {
        opacity: 1;
    }
}
</style>