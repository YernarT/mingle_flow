<template>
    <main class="add-cargo-page">
        <AuthTemplate without-logo without-else>
            <a-form :model="cargoForm" layout="vertical" @finish="handleAddCargo">
                <a-form-item label="Код" name="code" :rules="[{ required: true, message: 'Кодді енгізіңіз!' }]">
                    <a-input v-model:value="cargoForm.code" maxLength="24" placeholder="YT0001234567890">
                        <template #prefix>
                            <Icon name="material-symbols:barcode-scanner" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item label="Зат атауы" name="name" :rules="[{ required: true, message: 'Атауын енгізіңіз!' }]">
                    <a-input v-model:value="cargoForm.name" maxLength="30" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" html-type="submit" :loading="loadingAddCargo">Тіркеу</a-button>
                </a-form-item>
            </a-form>
        </AuthTemplate>

        <div v-if="recentlyAddedCargoList.length > 0" class="just-added">
            <div class="head">
                <h4 class="title">Жаңағана қосылған заттар</h4>
                <a-button @click="$router.push('/profile?tab=cargo')">Барлығын көру</a-button>
            </div>

            <CargoList :list="recentlyAddedCargoList" />
        </div>

        <RequestForwardModal v-if="requestForwardCargo" :is-open="requestForwardModalVisible" :cargo="requestForwardCargo"
            @cancel="requestForwardModalVisible = false" />
    </main>
</template>

<script setup lang="ts">
// Types
import type { I_Cargo } from '~/types/cargo';

// Vue
import { h } from 'vue';
// Store
import { useCargo } from '~/stores/cargo';
// API
import { API_AddCargo } from '~/service/api/cargo-api';
// Hooks
import useRequest from 'vue-hooks-plus/es/useRequest';
// Antd Component
import { notification, message as AntdMessage, Button } from 'ant-design-vue';
// Component
import AuthTemplate from '~/components/common/AuthTemplate.vue';
import CargoList from '~/components/cargo/CargoList.vue';
import RequestForwardModal from '~/components/cargo/RequestForwardModal.vue';

// 申请转发 相关状态
const requestForwardModalVisible = ref(false);
const requestForwardCargo = ref<I_Cargo>();

const recentlyAddedCargoList = ref<I_Cargo[]>([]);
const cargoForm = ref({
    code: '',
    name: '',
});

const cargo = useCargo();
const resetCargoForm = () => {
    cargoForm.value = {
        code: '',
        name: '',
    };
}

const { runAsync: addCargo, loading: loadingAddCargo } = useRequest(API_AddCargo, { manual: true });

const handleAddCargo = (values: any) => {
    addCargo(values).then(({ data }) => {
        resetCargoForm();
        AntdMessage.success('Сәтті тіркелді!');
        cargo.index.cargoList.push(data);
        recentlyAddedCargoList.value.push(data);
    }).catch((error) => {
        const key = `open${Date.now()}`;
        notification.error({
            key,
            message: error.message,
            duration: null,
            description: 'Әкімшіге өтініш жазу арқылы затты өзіңізге тіркеуге болады.',
            btn: () => h(Button, {
                onClick() {
                    requestForwardModalVisible.value = true;
                    requestForwardCargo.value = error.data;
                    notification.close(key);
                }
            }, 'Өтініш беру'),
        });
    });
}
</script>


<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.add-cargo-page {
    .just-added {
        .head {
            margin: 40px 0 20px 0;
            @include flex($justifyContent: space-between, $alignItems: center);

            button {
                @include flexCenter;
            }

            @media screen and (max-width: 886px) {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            @media screen and (max-width: 576px) {
                button {
                    width: 100%;
                }
            }
        }
    }
}
</style>