<template>
    <a-modal :open="isOpen" :footer="null" @cancel="$emit('cancel')">
        <AuthTemplate without-logo without-else class="auth-template">
            <p v-if="isMore" class="help-text help-text-red">Таңдалған {{ checkedCargoList.length }} жазбаға әсер етпек!</p>

            <a-form :model="cargoForm" layout="vertical" @finish="handleUpdateCargo">
                <a-form-item label="Зат атауы" name="name" :class="{ 'name-is-more': isMore }">
                    <a-input v-model:value="cargoForm.name" maxLength="30" />
                    <span v-if="isMore" class="help-text">Бос мәтін болғанда бәрінің атауы өзгермей қалады</span>
                </a-form-item>

                <a-form-item label="Архивта" name="isArchive" class="isArchive-field">
                    <Icon name="material-symbols:archive" />
                    <a-switch v-model:checked="cargoForm.isArchive" />
                </a-form-item>

                <a-form-item label="Статус" name="status" class="status-field">
                    <ul class="status-list">
                        <!-- @vue-skip -->
                        <li v-for="(status, index) in cargoForm.statuses" :key="status.id ??  index" class="status">
                            <div class="left">
                                <Icon
                                    :name="status.isSelected ? 'material-symbols:check-circle':'ic:sharp-radio-button-unchecked'"
                                    @click="handleSelectStatus(status, index)" />
                            </div>
                            <div class="right">
                                <span class="description">{{ status.description }}</span>
                                <span v-if="status.time" class="time">{{ dateFormatter(status.time) }}</span>
                            </div>
                        </li>
                    </ul>
                </a-form-item>

                <a-form-item v-if="isOpen" v-show="selectUserBlockVisible" label="Алушы" name="owner">
                    <SelectUser :initial="cargoForm.owner" @select="handleSelectUser" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="loadingBatchUpdateCargo">Өзгерісті сақтау</a-button>
                </a-form-item>
            </a-form>
        </AuthTemplate>
    </a-modal>
</template>

<script setup lang="ts">
// Types
import type { I_Cargo } from '~/types/cargo';

// Store
import { useCargo } from '~/stores/cargo'
// API
import { API_CargoBatchOperate } from '~/service/api/cargo-api';
// Hooks
import useRequest from 'vue-hooks-plus/es/useRequest';
// Antd Component
import { message as AntdMessage } from 'ant-design-vue';
// Component
import AuthTemplate from '~/components/common/AuthTemplate.vue';
import SelectUser from '~/components/common/SelectUser.vue';
// Constants
import { defaultStatuses } from '~/constants/cargo';
import { I_User } from 'types/user';

defineComponent({ name: 'UpdateCargoModal' });

const props = defineProps<{
    isOpen: boolean,
    checkedCargoList: I_Cargo[],
}>();

const $emit = defineEmits(['cancel']);
const { checkedCargoList, isOpen } = toRefs(props);

// Store Var
const cargoStore = useCargo();

const cargoForm = ref({
    id: null,
    name: '',
    isArchive: false,
    statuses: defaultStatuses,
    owner: null as I_User | null
});

// 是否是`批量操作`
const isMore = computed(() => checkedCargoList.value.length > 1);
// 是否需要选择接收人
const selectUserBlockVisible = computed(() => cargoForm.value.statuses.at(-1)?.isSelected);

watch(checkedCargoList, (newProps) => {
    if (newProps.length === 1) {
        // @ts-ignore
        cargoForm.value = { ...newProps[0], statuses: newProps[0].statusList.map(status => ({ ...status, isSelected: status.time !== null })) };
    } else {
        cargoForm.value = {
            id: null,
            name: '',
            isArchive: false,
            statuses: defaultStatuses,
            owner: null,
        }
    }
}, { immediate: true });

const handleSelectStatus = (status: I_Cargo & { isSelected: boolean }, index: number) => {
    const toBeVal = !status.isSelected;
    if (index === 0 && toBeVal === false) {
        AntdMessage.warning('Бірінші статус кетірілмейді');
        return;
    }

    if (toBeVal) {
        cargoForm.value.statuses = cargoForm.value.statuses.map((item, idx) => {
            if (idx <= index) {
                item.isSelected = toBeVal;
            }
            return item;
        });
        return;
    }

    cargoForm.value.statuses = cargoForm.value.statuses.map((item, idx) => {
        if (idx >= index) {
            item.isSelected = toBeVal;
        }
        return item;
    });
}

const { runAsync: batchUpdateCargo, loading: loadingBatchUpdateCargo } = useRequest(API_CargoBatchOperate, { manual: true });

const handleSelectUser = (user: I_User | null) => {
    cargoForm.value.owner = user;
}

const handleUpdateCargo = () => {
    // 如果 cargoId 为 字符串类型 说明是本地修改, 直接修改 store 里的值
    // 如果是 数字类型 说明是服务端的数据, 需要发送修改请求

    // 单个修改
    if (cargoForm.value.id) {
        // 修改数据库
        if (typeof cargoForm.value.id === 'number') {
            const payload = {
                isEdit: true,
                name: cargoForm.value.name,
                isArchive: cargoForm.value.isArchive,
                owner: cargoForm.value.owner?.id ?? null,
                statuses: cargoForm.value.statuses.map(status => status.isSelected)
            };

            // 没有选择物品主人
            if (payload.statuses.at(-1) && payload.owner === null) {
                AntdMessage.error('Алушыны таңдаңыз');
                return;
            }

            // @ts-ignore 动态新增 cargoList 属性
            // cargoId + statusId []
            payload.cargoList = checkedCargoList.value.map(({ id, statusList }) => ({ id, statusList: statusList.map(({ id }) => id) }));

            batchUpdateCargo(payload).then(({ data }) => {
                cargoStore.database.cargoList = data.map(cargo => ({ ...cargo, checked: false }));
                AntdMessage.success('Өзгеріс сақталды');
                $emit('cancel');
            }).catch(({ message }) => {
                AntdMessage.error(message);
            });
            return;
        }
        // 本地修改
        else {
            const editedFields = {
                id: cargoForm.value.id,
                name: cargoForm.value.name,
                isArchive: cargoForm.value.isArchive,
                owner: cargoForm.value.owner ?? null,
                statuses: cargoForm.value.statuses.map(status => status.isSelected)
            };

            // 没有选择物品主人
            if (editedFields.statuses.at(-1) && editedFields.owner === null) {
                AntdMessage.error('Алушыны таңдаңыз');
                return;
            }

            // @ts-ignore
            cargoStore.addedCargoListFromFile.cargoList = cargoStore.addedCargoListFromFile.cargoList.map(cargo => {
                if (cargo.id === editedFields.id) {
                    return ({
                        ...cargo, ...editedFields, statusList: cargo.statusList.map((status, index) => ({
                            ...status,
                            time: cargoForm.value.statuses[index] ? new Date() : null
                        }
                        ))
                    });
                }
                return cargo;
            })
            AntdMessage.success('Өзгеріс сақталды');
            $emit('cancel');
        }
        return;
    }

    // 单个修改 ↑
    // 批量操作 ↓
    const isEdit = cargoStore.addedCargoListFromFile.cargoList.length === 0;
    const payload = {
        isEdit: true,
        name: cargoForm.value.name,
        isArchive: cargoForm.value.isArchive,
        owner: cargoForm.value.owner?.id ?? null,
        statuses: cargoForm.value.statuses.map(status => status.isSelected)
    };

    // 没有选择物品主人
    if (payload.statuses.at(-1) && payload.owner === null) {
        AntdMessage.error('Алушыны таңдаңыз');
        return;
    }

    // 批量修改 服务端
    if (isEdit) {
        // @ts-ignore 动态新增 cargoList 属性
        // cargoId + statusId []
        payload.cargoList = checkedCargoList.value.map(({ id, statusList }) => ({ id, statusList: statusList.map(({ id }) => id) }));

        batchUpdateCargo(payload).then(({ data }) => {
            cargoStore.database.cargoList = data.map(cargo => ({ ...cargo, checked: false }));
            AntdMessage.success('Өзгеріс сақталды');
            $emit('cancel');
        }).catch(({ message }) => {
            AntdMessage.error(message);
        });
        return;
    }

    // 批量修改本地
    checkedCargoList.value.forEach(({ id }) => {
        cargoStore.addedCargoListFromFile.cargoList = cargoStore.addedCargoListFromFile.cargoList.map((cargoInFile => {
            if (cargoInFile.id === id) {
                return {
                    ...cargoInFile,
                    checked: false,
                    name: payload.name || cargoInFile.name,
                    isArchive: payload.isArchive,
                    owner: cargoForm.value.owner,
                    statusList: cargoInFile.statusList.map((originStatus, index) => {
                        if (payload.statuses[index]) {
                            return {
                                ...originStatus,
                                time: dateFormatter(new Date().toString()),
                            }
                        }
                        return originStatus;
                    })
                };
            }

            return cargoInFile;
        }));
    });

    AntdMessage.success('Өзгеріс сақталды');
    $emit('cancel');
}
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.auth-template {
    width: 100%;
    height: 100%;

    .help-text {
        display: block;
        margin-top: 4px;
        height: max-content;
        font-weight: 300;
        font-size: 14px;
        line-height: 1.5;
        color: var(--c-text-secondary);
    }

    .help-text-red {
        width: calc(100% - 24px);
        margin: 8px 0 16px 0;
        color: #ff0000;
        align-self: flex-start;
    }

    .name-is-more {
        margin-bottom: 42px;

        @media screen and (max-width: 440px) {
            margin-bottom: 70px;
        }
    }

    .ant-form {
        width: 100%;
    }

    :deep(.isArchive-field) {
        .ant-form-item-control-input-content {
            @include flex($alignItems: center, $gap: 8px);

            svg {
                @include svgStyle($size: 40px, $color: var(--c-primary), $stroke: transparent);
            }

            .ant-switch {
                width: 64px;
                height: 32px;

                .ant-switch-handle::before {
                    transform: translate(12%, 6%);
                }

                &-checked {
                    .ant-switch-handle::before {
                        transform: translate(-12%, 6%);
                    }
                }
            }
        }
    }

    :deep(.status-field) {
        .ant-form-item-control-input-content {
            height: 100%;
        }
    }

    .status-list {
        height: 100% !important;
        @include flex($direction: column, $gap: 12px);

        .status {
            @include flex($alignItems: center, $gap: 8px);

            svg {
                cursor: pointer;
                @include svgStyle($size: 32px);
            }

            .right {
                @include flex($direction: column, $gap: 4px);

                .description,
                .time {
                    font-size: 16px;
                }

                .description {
                    color: var(--c-text-secondary);
                }

                .time {
                    font-weight: 500;
                }
            }
        }
    }

    :deep(.ant-select-selector) {
        padding: 8px 12px;
        height: auto;

        .ant-select-selection-search-input {
            height: 100%;
        }
    }

    :deep(.ant-select-arrow) {
        transform: translateY(25%);
    }
}
</style>