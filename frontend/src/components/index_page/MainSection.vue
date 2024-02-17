<template>
    <section class="itisit-container main-section">
        <h1 class="main-title">
            Топ аралық, Ынтымақтастық,
            <br />
            Жобаны басқарудың
            <br />
            біріктірілген жүйесі
        </h1>
        <p class="leading">
            Mingle Flow = Топтық ынтымақтастық + Процесті басқару
        </p>
        <div class="auth-btns">
            <a-button type="primary" @click="$router.push(userStore.isAuthenticated ? '/main' : '/auth/login')">
                Бастау
            </a-button>
            <a-button @click="$router.push('/auth/login')">Тіркелу</a-button>
        </div>
    </section>
</template>

<script setup lang="ts">
// Vue
import { defineComponent } from 'vue';
// Store
import { useUser } from '@/stores/user';

defineComponent({ name: 'MainSection' });

const userStore = useUser();
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.main-section {
    margin-top: 60px;
    position: relative;

    &::after {
        content: '';
        display: block;
        width: 100%;
        height: 60dvh;
        background:
            linear-gradient(to right, rgb(240, 241, 246) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(240, 241, 246) 1px, transparent 1px);
        background-size: 52px 52px;
        mask-image: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%);
        @include positioned($top: -80px, $left: 0);
    }

    .main-title {
        font-weight: 500;
        font-size: 50px;
        text-align: center;
        background: linear-gradient(62deg, #4060ff, #bf80ff 82.51%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        @include positioned($position: relative, $zIndex: 2);
    }

    .leading {
        margin-top: 24px;
        text-align: center;
        @include positioned($position: relative, $zIndex: 2);
    }

    .auth-btns {
        margin-top: 40px;
        @include flexCenter($gap: 28px);
        @include positioned($position: relative, $zIndex: 2);

        .ant-btn {
            padding: 12px 32px;
            height: 48px;
            border-radius: 999px;
        }
    }


    /* Responsive */
    @media screen and (max-width: 576px) {
        margin-top: 32px;

        &::after {
            top: -56px;
            height: 72dvh;
            background-size: 40px 40px;
        }

        .main-title {
            font-size: 28px;
        }

        .leading {
            font-size: 14px;
        }

        .auth-btns {
            margin-top: 28px;
            flex-direction: column;
            gap: 12px;

            .ant-btn {
                min-width: 166px;
            }
        }
    }
}
</style>