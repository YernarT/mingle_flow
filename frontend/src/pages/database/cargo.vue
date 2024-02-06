<template>
    <main class="cargo-page">
        <div class="head">
            <a-button @click="$router.go(-1)">
                <Icon name="material-symbols:arrow-left-alt-rounded" />
            </a-button>

            <h3 class="title">Логистика</h3>
        </div>

        <div class="content">
            <div class="head">
                <h4 v-html="headTitle" class="title"></h4>

                <div class="actions">
                    <a-dropdown v-if="!showCargoFromFile" placement="bottomRight" overlay-class-name="add-cargo-dropdown"
                        trigger="click">
                        <a-button>Қосу
                            <Icon name="material-symbols:add-circle" />
                        </a-button>

                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a-button @click="addCargoModalVisible = true">
                                        Форма арқылы
                                    </a-button>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-button @click="$excelFileInput?.click()">
                                        Файл арқылы
                                    </a-button>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                    <a-button v-if="!showCargoFromFile" @click="cargo.fetchCargoList('database')">Жаңарту
                        <Icon name="material-symbols:sync-outline" />
                    </a-button>
                    <a-button v-if="showCargoFromFile" @click="cargo.addedCargoListFromFile.cargoList = []">
                        Бастарту
                        <Icon name="material-symbols:cancel-rounded" />
                    </a-button>
                    <a-button v-if="showCargoFromFile" :loading="loadingBatchUpdateCargo"
                        @click="handleUploadCargoFromFile">
                        Жүктеу
                        <Icon name="material-symbols:upload-sharp" />
                    </a-button>
                </div>
            </div>

            <input ref="$excelFileInput" class="excel-file" type="file" accept=".xls, .xlsx" />

            <CargoTable :dataSource="cargoTableData"
                :loading="cargo.database.fetchCargoListLoading || cargo.addedCargoListFromFile.addLoading"
                @edit="handleEdit" />
            <AddCargoModal :is-open="addCargoModalVisible" @cancel="addCargoModalVisible = false" />
            <UpdateCargoModal :is-open="updateCargoModalVisible" :checked-cargo-list="cargoToBeUpdated"
                @cancel="updateCargoModalVisible = false" />
        </div>
    </main>
</template>

<script setup lang="ts">
// Types
import type { I_Cargo } from "~/types/cargo";

// Store
import { useCargo } from "~/stores/cargo";
import { useUser } from "~/stores/user";
// Hooks
import { useEventListener, useRequest } from "vue-hooks-plus";
// API
import { API_CargoBatchOperate } from '~/service/api/cargo-api';
// Utils
import * as XLSX from 'xlsx';
// Antd Component
import { message as AntdMessage } from 'ant-design-vue';
// Component
import CargoTable from "~/components/database_page/CargoTable.vue";
import AddCargoModal from "~/components/database_page/AddCargoModal.vue";
import UpdateCargoModal from "~/components/database_page/UpdateCargoModal.vue";

// store var
const cargo = useCargo();
const user = useUser();
const addCargoModalVisible = ref(false);
const updateCargoModalVisible = ref(false);
const cargoToBeUpdated = ref<I_Cargo[]>([]);

const $excelFileInput = ref<HTMLInputElement>();

onBeforeMount(() => {
    cargo.fetchCargoList('database').catch(error => {
        console.log(error);
    });
});

onMounted(() => {
    useEventListener('change', (e) => {
        // @ts-ignore
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // 文件类型限制
        const allowedExtensions = ['xls', 'xlsx'];
        const fileExtension = selectedFile.name.split('.').pop();

        if (!allowedExtensions.includes(fileExtension)) {
            AntdMessage.error('Excel файлын таңдаңыз (.xls немесе .xlsx)');
            // 清空文件
            $excelFileInput.value!.value = '';
            return;
        }

        const fileReader = new FileReader();
        let workbook: XLSX.WorkBook;
        let cargoCodes: Record<I_Cargo['code'], I_Cargo['code']>[] = [];
        cargo.addedCargoListFromFile.addLoading = true;

        fileReader.onload = function (e) {
            const data = e.target?.result;
            workbook = XLSX.read(data, { type: 'binary' });

            for (let sheet in workbook.Sheets) {
                cargoCodes = cargoCodes.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            }

            cargo.addedCargoListFromFile.cargoList = [
                ...Object.keys(cargoCodes[0]).map(code => getEmptyCargo(code, { ...user }, true)),
                ...cargoCodes.map(codeObj => {
                    return Object.values(codeObj).map(code => getEmptyCargo(code, { ...user }, true));
                })].flat();
            cargo.addedCargoListFromFile.addLoading = false;
        }

        fileReader.readAsBinaryString(selectedFile);

    }, { target: $excelFileInput.value });
});


const showCargoFromFile = computed(() => cargo.addedCargoListFromFile.cargoList.length > 0);

const cargoTableData = computed(() => {
    if (showCargoFromFile.value) {
        return cargo.addedCargoListFromFile.cargoList;
    }

    return cargo.database.cargoList;
});

const headTitle = computed(() => {
    if (showCargoFromFile.value) {
        return `Файлдан табылған <strong>${cargo.addedCargoListFromFile.cargoList.length}</strong> жазба`;
    }

    return `Деректер қорында сақталған <strong>${cargo.database.cargoList.length}</strong> жазба`;
});

const handleEdit = (aCargo: I_Cargo) => {
    const selectedCargoList = cargo[showCargoFromFile.value ? 'addedCargoListFromFile' : 'database'].cargoList.filter(c => c.checked);
    // 点击 `Edit` 按钮的 cargo 是被选中的
    if (selectedCargoList.some(selectedCargo => selectedCargo.id === aCargo.id)) {
        cargoToBeUpdated.value = selectedCargoList;
    } else {
        cargoToBeUpdated.value = [aCargo];
    }

    updateCargoModalVisible.value = true;
}

const { runAsync: batchUpdateCargo, loading: loadingBatchUpdateCargo } = useRequest(API_CargoBatchOperate, { manual: true });

const handleUploadCargoFromFile = () => {
    const cargoList = cargo.addedCargoListFromFile.cargoList.filter(cargo => cargo.checked).map(cargo => ({
        code: cargo.code,
        name: cargo.name,
        isArchive: cargo.isArchive,
        owner: cargo.owner?.id ?? null,
        statuses: cargo.statusList.map(status => Boolean(status.time))
    }));

    if (cargoList.length === 0) {
        AntdMessage.warning('Деректерді таңдаңыз');
        return;
    }

    const payload = {
        isEdit: false,
        name: '',
        isArchive: false,
        cargoList,
        owner: null,
        statuses: [null]
    };

    batchUpdateCargo(payload).then(({ data }) => {
        cargo.database.cargoList = data.map(cargo => ({ ...cargo, checked: false }));
        AntdMessage.success('Жазбалар жүктелді');
    }).catch(({ message }) => {
        AntdMessage.error(message);
    });;
}
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.cargo-page {
    height: 100%;

    >.head {
        margin-bottom: 32px;
        @include flex($alignItems: center, $gap: 16px);

        .ant-btn {
            width: 64px;
            height: 48px;
            @include flexCenter;

            svg {
                @include svgStyle($size: 32px, $color: var(--c-primary));
            }
        }

        .title {
            font-weight: 500;
            font-size: 24px;
        }
    }

    .content {
        position: relative;
        height: calc(100% - 48px - 32px);
        @include flex($direction: column);

        .head {
            width: 100%;
            margin-bottom: 16px;
            @include flex;

            .actions {
                flex: 0 0 auto;
                margin-left: auto;
                @include flex($alignItems: center, $gap: 8px);
            }

            .ant-btn {
                @include flexCenter($gap: 8px);

                svg {
                    @include svgStyle($color: var(--c-primary));
                }
            }

            @media screen and (max-width: 992px) {
                flex-direction: column;
                gap: 8px;

                .actions {
                    width: 100%;

                    .ant-btn {
                        flex: 1 1 auto;
                    }
                }
            }
        }
    }

    .excel-file {
        display: none;
    }
}
</style>
