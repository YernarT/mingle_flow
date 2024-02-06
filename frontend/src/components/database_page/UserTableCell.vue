<template>
    <div class="cell" :class="th.dataIndex">
        <a-checkbox v-if="th.dataIndex === 'id'" v-model:checked="user.checked" />
        <template v-else-if="th.dataIndex === 'action'">
            <a-button disabled>
                <Icon name="material-symbols:edit-square-rounded" />
            </a-button>
            <a-popconfirm title="Жоюға сенімдісіз бе?" placement="left" ok-text="Ия" :show-cancel="false"
                @confirm="$emit('delete', user)">
                <a-button danger>
                    <Icon name="ic:baseline-delete-forever" />
                </a-button>
            </a-popconfirm>
        </template>
        <span v-else-if="th.dataIndex === 'role'" :class="{ [th.dataIndex]: true }">
            <Icon v-if="user[th.dataIndex] === role.admin" name="eos-icons:admin" />
            <Icon v-else name="ic:baseline-person" />
        </span>
        <span v-else-if="th.dataIndex === 'createTime'" :class="{ [th.dataIndex]: true }">
            {{ dateFormatter(user[th.dataIndex]) }}
        </span>
        <span v-else :class="{ [th.dataIndex]: true }">{{ user[th.dataIndex] }}</span>
    </div>
</template>

<script setup lang="ts">
// Types
import type { I_User } from '~/types/user';

defineEmits<{
    (e: 'delete', user: I_User): void
}>();

const props = defineProps({
    user: {
        type: Object as PropType<I_User & { checked: boolean }>,
        required: true
    },
    th: {
        type: Object as PropType<{
            title: string,
            dataIndex: keyof I_User | 'action'
        }>,
        required: true
    },
});

const { user, th } = toRefs(props);

// 格式化时间
const dateFormatter = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();

    return `${year} / ${month} / ${day}`
}

</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.cell {
    height: 60px;
    padding: 16px;
    cursor: default;
    @include flex($alignItems: center);

    &:not(:last-child) {
        border: 1px solid var(--c-border);
        border-top: none;
        border-left: none;
    }

    span {
        font-size: 16px;
        @include maxRow;
    }

    &.id {
        width: 48px;
        flex: 0 0 48px;
    }

    &.phone {
        width: 132px;
        flex: 0 0 132px;

        span {
            font-weight: 500;
        }
    }

    &.fullname {
        width: 120px;
        flex: 1 0 120px;
    }

    &.role {
        width: 70px;
        flex: 0 0 70px;

        svg {
            @include svgStyle($color: var(--c-primary));
        }
    }

    &.createTime {
        width: 191px;
        flex: 0 0 191px;
    }

    &.action {
        width: 124px;
        flex: 0 0 124px;
        padding: 8px 16px;

        .ant-btn {
            padding: 0 8px;
            @include flexCenter;

            &:first-child svg {
                @include svgStyle($color: var(--c-primary));
            }

            &:last-child {
                margin-left: 8px;

                svg {
                    @include svgStyle($color: var(--c-error));
                }
            }
        }
    }
}
</style>