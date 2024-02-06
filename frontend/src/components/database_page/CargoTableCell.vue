<template>
    <div class="cell" :class="th.dataIndex">
        <!-- @vue-skip -->
        <a-checkbox v-if="th.dataIndex === 'id'" v-model:checked="cargoProps.checked" />
        <span v-else-if="th.dataIndex === 'code'" class="code">{{ cargo[th.dataIndex] }}</span>
        <span v-else-if="th.dataIndex === 'name'" class="name">{{ cargo[th.dataIndex] }}</span>
        <span v-else-if="th.dataIndex === 'isArchive'" class="is-archive">
            <Icon name="material-symbols:archive" />
            <a-switch size="small" :checked="cargo[th.dataIndex]" :disabled="loadingUpdateCargo"
                @change="handleSwitchArchiveState" />
        </span>
        <span v-else-if="isUserCell" class="user-cell">
            <Icon v-if="(cargo[th.dataIndex] as I_User).role === role.admin" name="eos-icons:admin" />
            <Icon v-else name="ic:baseline-person" />
            <span :title="(cargo[th.dataIndex] as I_User).fullname">{{ (cargo[th.dataIndex] as I_User).fullname }}</span>
        </span>
        <span v-else-if="th.dataIndex === 'owner' && cargoProps.owner === null" class="owner">
            Иесі жоқ
        </span>
        <template v-else>
            <a-button @click="$emit('edit', cargoProps)">
                <Icon name="material-symbols:edit-square-rounded" />
            </a-button>
            <a-popconfirm title="Жоюға сенімдісіз бе?" placement="left" ok-text="Ия" cancel-text="Жоқ"
                @confirm="handleDelete" :disabled="loadingDeleteCargo">
                <a-button danger>
                    <Icon name="ic:baseline-delete-forever" />
                </a-button>
            </a-popconfirm>
        </template>
    </div>
</template>

<script setup lang="ts">
// Types
import type { I_User } from '~/types/user';
import type { I_Cargo } from '~/types/cargo';

// Store
import { useCargo } from '~/stores/cargo';
// Hooks
import { useRequest } from 'vue-hooks-plus';
// API
import { API_UpdateCargo, API_DeleteCargo } from '~/service/api/cargo-api';
// Antd Component
import { message as AntdMessage } from 'ant-design-vue';

const props = defineProps({
    cargo: {
        type: Object as PropType<I_Cargo & { checked: boolean }>,
        required: true
    },
    th: {
        type: Object as PropType<{
            title: string,
            dataIndex: keyof I_Cargo
        }>,
        required: true
    },
});

const $emit = defineEmits<{ (e: 'edit', cargo: I_Cargo): void }>();

const cargoStore = useCargo();
const { cargo: cargoProps, th } = toRefs(props);

const isUserCell = computed(() => {
    return th.value.dataIndex === 'creator' || (th.value.dataIndex === 'owner' && cargoProps.value.owner !== null);
});

// 更新 Cargo
const { run: updateCargo, loading: loadingUpdateCargo } = useRequest(API_UpdateCargo, {
    manual: true, onSuccess({ data }) {
        cargoStore.database.cargoList = cargoStore.database.cargoList.map(c => {
            if (c.id === data.id) {
                c.isArchive = data.isArchive;
                return c;
            }

            return c;
        })
    },
    onError(error) {
        console.log(error);
    },
});

// 删除 Cargo
const { run: deleteCargo, loading: loadingDeleteCargo } = useRequest(API_DeleteCargo, {
    manual: true, onSuccess(_, [cargoId]) {
        cargoStore.database.cargoList = cargoStore.database.cargoList.filter(c => c.id !== cargoId);
    },
    onError(error) {
        console.log(error);
    },
});

const handleSwitchArchiveState = (isArchive: boolean) => {
    // 文件批量操作
    if (cargoStore.addedCargoListFromFile.cargoList.length > 0) {
        cargoStore.addedCargoListFromFile.cargoList = cargoStore.addedCargoListFromFile.cargoList.map(c => {
            if (c.id === cargoProps.value.id) {
                c.isArchive = isArchive;
            }

            return c;
        })

        return;
    }

    updateCargo(cargoProps.value.id, { isArchive });
}


const handleDelete = () => {
    // 文件批量操作
    if (cargoStore.addedCargoListFromFile.cargoList.length > 0) {
        cargoStore.addedCargoListFromFile.cargoList = cargoStore.addedCargoListFromFile.cargoList.filter(c => c.id !== cargoProps.value.id);
        AntdMessage.success('Жойылды');
        return;
    }

    deleteCargo(cargoProps.value.id);
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

    &.code {
        width: 172px;
        flex: 0 0 172px;
    }

    .code {
        font-weight: 500;
    }

    &.name {
        width: 100px;
        flex: 1 0 100px;
    }

    &.isArchive {
        width: 94px;
        flex: 0 0 94px;
        @include flexCenter;

        svg {
            @include svgStyle($color: var(--c-primary));
        }
    }

    .is-archive {
        @include flex($direction: column, $alignItems: center, $gap: 2px);
    }

    &.creator,
    &.owner {
        width: 120px;
        flex: 0 0 120px;
        cursor: pointer;
    }

    .user-cell {
        @include flex($alignItems: center, $gap: 2px);

        svg {
            flex-shrink: 0;
            @include svgStyle($color: var(--c-primary));
        }

        span {
            color: var(--c-primary);
            @include maxRow($rowCount: 1);
        }
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