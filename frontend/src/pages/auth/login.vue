<template>
    <main class="login-page">
        <AuthTemplate>
            <a-form hideRequiredMark :model="loginForm" layout="vertical" autocomplete="off" @finish="onFinish">
                <a-form-item label="Email" name="email" :rules="[{ required: true, message: 'Email енгізіңіз!' }]">
                    <a-input v-model:value="loginForm.email" type="email" maxLength="254" />
                </a-form-item>

                <a-form-item label="Құпиясөз" name="password"
                    :rules="[{ required: true, message: 'Құпиясөзді енгізіңіз!' }]">
                    <a-input-password v-model:value="loginForm.password" maxLength="254" />
                </a-form-item>

                <a-form-item class="">
                    <a-button block :loading="loading" type="primary" html-type="submit">Кіру / Тіркелу</a-button>
                </a-form-item>
            </a-form>
        </AuthTemplate>
    </main>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue';
// // Vue Router
import { useRouter } from 'vue-router';
// // Store
import { useUser } from '@/stores/user';
// // API
import { API_Login } from '~/service/api/user-api';
// // Hooks
import useRequest from 'vue-hooks-plus/es/useRequest';
// Antd Component
import { message as AntdMessage } from 'ant-design-vue';
// Component
import AuthTemplate from '@/components/common/AuthTemplate.vue';

defineComponent({ name: 'LoginPage' });

const user = useUser();
const router = useRouter();

const loginForm = ref({
    email: '',
    password: '',
});

const { runAsync, loading } = useRequest(API_Login, { manual: true });

const onFinish = (values: any) => {
    runAsync(values).then(({ data }) => {
        localStorage.set('user', data);
        user.$state = data;
        AntdMessage.success('Қош келдіңіз!');
        router.replace('/profile');
    }).catch(error => {
        AntdMessage.error(error.message);
    })
};
</script>

<style scoped lang="scss">
@import '~/assets/style/mixins.scss';

.login-page {

    :deep(.ant-form) {
        label {
            font-size: 18px;
            color: rgb(81, 89, 99);
        }

        input {
            height: 40px;
            color: rgb(194, 202, 209);
            border-color: var(--c-border);
            background-color: transparent;
        }

        .ant-form-item-explain-error {
            font-size: 14px;
            margin-top: 2px;
        }

        .ant-input-password {
            padding-top: 0;
            padding-bottom: 0;
            border-color: var(--c-border);
            background-color: transparent;

            .ant-input-password-icon svg {
                @include svgStyle($color: rgb(194, 202, 209), $size: 20px);
            }
        }


        button[type='submit'] {
            height: 44px;
            margin-top: 20px;
        }

        .ant-form-item:last-child {
            margin: 0;
        }
    }
}
</style>
