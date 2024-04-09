<template>
  <a-modal :open="isOpen" :footer="null" @cancel="$emit('cancel')">
    <AuthTemplate without-logo without-else>
      <a-form :model="cargoForm" layout="vertical" @finish="handleAddCargo">
        <a-form-item
          label="Код"
          name="code"
          :rules="[{ required: true, message: 'Кодді енгізіңіз!' }]"
        >
          <a-input
            v-model:value="cargoForm.code"
            maxLength="24"
            placeholder="YT0001234567890"
          >
            <template #prefix>
              <Icon name="material-symbols:barcode-scanner" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="Зат атауы"
          name="name"
          :rules="[{ required: true, message: 'Атауын енгізіңіз!' }]"
        >
          <a-input v-model:value="cargoForm.name" maxLength="30" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loadingAddCargo"
            >Тіркеу</a-button
          >
        </a-form-item>
      </a-form>
    </AuthTemplate>
  </a-modal>
</template>

<script setup lang="ts">
// Store
import { useCargo } from "~/stores/cargo";
// API
import { API_AddCargo } from "~/service/api/cargo-api";
// Hooks
import useRequest from "vue-hooks-plus/es/useRequest";
// Antd Component
import { message as AntdMessage } from "ant-design-vue";
// Component
import AuthTemplate from "~/components/common/AuthTemplate.vue";

defineOptions({ name: "AddCargoModal" });

defineProps<{
  isOpen: boolean;
}>();

const $emit = defineEmits(["cancel"]);

// Store var
const cargo = useCargo();

const cargoForm = ref({
  code: "",
  name: "",
});
const resetCargoForm = () => {
  cargoForm.value = {
    code: "",
    name: "",
  };
};

const { runAsync: addCargo, loading: loadingAddCargo } = useRequest(
  API_AddCargo,
  { manual: true }
);

const handleAddCargo = (values: any) => {
  addCargo(values)
    .then(({ data }) => {
      resetCargoForm();
      AntdMessage.success("Сәтті қосылды!");
      cargo.database.cargoList.push({ ...data, checked: false });
    })
    .catch((error) => {
      AntdMessage.error(error.message);
    });
};
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";
</style>
