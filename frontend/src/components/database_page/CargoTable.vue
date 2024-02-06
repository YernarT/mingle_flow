<template>
    <div ref="$cargoTable" class="cargo-table" :class="{ 'cargo-table--loading': loading }">
        <div class="head">
            <div v-for="th in cargoTableHeads" :key="th.dataIndex" class="th" :class="th.dataIndex">
                <!-- @vue-skip -->
                <a-checkbox v-if="th.dataIndex === 'id'" :checked="checkAll" :disabled="dataSource.length === 0"
                    @change="$event => cargo.toggleCheckedState($event.target.checked)" />
                <span v-else>{{ th.title }}</span>
            </div>
        </div>

        <div class="body">
            <div v-for="data in dataSource" :key="data.id" class="row">
                <!-- @vue-skip -->
                <CargoTableCell v-for="th in cargoTableHeads" :key="data.id + th.dataIndex" :cargo="data" :th="th"
                    @edit="$cargoVal=>$emit('edit', $cargoVal)" />
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
import type { I_Cargo } from '~/types/cargo';

// Store
import { useCargo } from '~/stores/cargo';
// 常量
import { cargoTableHeads } from '~/constants/table';
// Component
import CargoTableCell from './CargoTableCell.vue';

const props = defineProps({
    dataSource: {
        type: Object as PropType<(I_Cargo & { checked: boolean })[]>,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const $emit = defineEmits<{ (e: 'edit', cargo: I_Cargo): void }>();

// store var
const cargo = useCargo();

const { dataSource, loading } = toRefs(props);
const $cargoTable = ref();

onMounted(() => {
    const { width } = ($cargoTable.value as HTMLDivElement).getBoundingClientRect();
});

const checkAll = computed(() => {
    if (cargo.addedCargoListFromFile.cargoList.length > 0) {
        return !cargo.addedCargoListFromFile.cargoList.some(cargo => !cargo.checked);
    }

    return !cargo.database.cargoList.some(cargo => !cargo.checked);
});

</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.cargo-table {
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

            &.code {
                width: 172px;
                flex: 0 0 172px;
            }

            &.name {
                width: 100px;
                flex: 1 0 100px;
            }

            &.isArchive {
                width: 94px;
                flex: 0 0 94px;
            }

            &.creator,
            &.owner {
                width: 120px;
                flex: 0 0 120px;
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