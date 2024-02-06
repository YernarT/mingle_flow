<template>
    <a-modal :open="isOpen" :footer="null" @cancel="$emit('cancel')">
        <AuthTemplate without-logo without-else>
            <a-form :model="userForm" layout="vertical" @finish="handleAddCargo">
                <a-form-item>
                    <a-radio-group v-model:value="userForm.role">
                        <a-radio :value="role.admin">Админ</a-radio>
                        <a-radio :value="role.user">Қолданушы</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item label="Аты-жөн" name="fullname"
                    :rules="[{ required: true, message: 'Аты-жөн нөмерді енгізіңіз!' }]">
                    <a-input v-model:value="userForm.fullname" maxLength="30" />
                </a-form-item>

                <a-form-item label="Телефон" name="phone"
                    :rules="[{ required: true, message: 'Телефон нөмерді енгізіңіз!' }]">
                    <a-input v-model:value="userForm.phone" type="tel" placeholder="87771234567" maxLength="11" />
                </a-form-item>

                <a-form-item label="Құпиясөз" name="password"
                    :rules="[{ required: true, message: 'Құпиясөзді енгізіңіз!' }]">
                    <a-input-password v-model:value="userForm.password" maxLength="254" />
                </a-form-item>

                <a-form-item>
                    <a-button :loading="loadingAddUser" type="primary" html-type="submit">Қосу</a-button>
                </a-form-item>
            </a-form>
        </AuthTemplate>
    </a-modal>
</template>

<script setup lang="ts">
// Types
import type { I_User } from '~/types/user';

// API
import { API_Register } from '~/service/api/user-api';
// Hooks
import useRequest from 'vue-hooks-plus/es/useRequest';
// Antd Component
import { message as AntdMessage } from 'ant-design-vue';
// Component
import AuthTemplate from '~/components/common/AuthTemplate.vue';

defineComponent({ name: 'AddCargoModal' });

defineProps<{
    isOpen: boolean
}>();

const $emit = defineEmits<{
    (event: 'add', addedUser: I_User): void
    (event: 'cancel'): void
}>();

const userForm = ref({
    phone: '',
    fullname: '',
    password: '',
    role: role.user
});
const resetUserForm = () => {
    userForm.value = {
        phone: '',
        fullname: '',
        password: '',
        role: role.user
    };
}

const { runAsync: addUser, loading: loadingAddUser } = useRequest(API_Register, { manual: true });

const handleAddCargo = () => {
    addUser(toRaw(userForm.value)).then(({ data }) => {
        resetUserForm();
        AntdMessage.success('Сәтті қосылды!');
        $emit('cancel');
        $emit('add', data);
    }).catch(error => {
        AntdMessage.error(error.message);
    })
}
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";
</style>