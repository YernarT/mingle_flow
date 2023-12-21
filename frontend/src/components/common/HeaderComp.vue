<template>
    <header class="itisit-container header">
        <div class="logo">
            <img src="/image/logo.png" alt="Mingle Flow">
            <span>Mingle Flow</span>
        </div>

        <div class="menu">
            <div class="icon-btn" @click="toNotification">
                <Icon name="material-symbols:notifications-sharp" />
            </div>
            <div class="icon-btn" @click="toSettings">
                <Icon name="material-symbols:settings" />
            </div>

            <div class="user-block">
                <!-- 动态获取 Public 目录下的资源 -->
                <img :src="userStore.isAuthenticated ? userStore.avatar : '/image/unauthorized_user_avatar.jpg'"
                    alt="Avatar" class="avatar" @click="toSettings" />

                <div class="info">
                    <span class="username">{{ userStore.isAuthenticated ? userStore.fullname : 'Авторизациясыз' }}</span>
                    <span class="email">{{ userStore.isAuthenticated ? userStore.email : '' }}</span>
                </div>
            </div>
        </div>

        <Icon class="mobile-menu-btn" name="ri:menu-3-line" />
    </header>
</template>

<script setup lang="ts">
// Vue
import { defineComponent } from 'vue';
// Router
import { useRouter } from 'vue-router';
// Store
import { useUser } from '@/stores/user';
// Antd
import { message as AntdMessage } from 'ant-design-vue';

defineComponent({ name: 'HeaderComp' });

const userStore = useUser();
const $router = useRouter();

const hasAuthentication = () => {
    if (!userStore.isAuthenticated) {
        AntdMessage.info('Авторизациясыз, әрекетке рұқсат жоқ');
        return false;
    }

    return true;
}

const toNotification = () => hasAuthentication() && $router.push('/profile?tab=notification');
const toSettings = () => hasAuthentication() && $router.push('/profile?tab=settings');
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.header {
    height: 64px;
    @include flex($alignItems: center);

    .logo {
        @include flex($alignItems: center, $gap: 8px);

        img {
            width: 34px;
            height: 34px;
            object-fit: cover;
        }

        span {
            font-weight: 500;
        }
    }

    .menu {
        margin-left: auto;
        @include flex($alignItems: center, $gap: 16px);

        @media screen and (max-width: 722px) {
            display: none;
        }

        .icon-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid rgb(240, 241, 246);
            cursor: pointer;
            transition: box-shadow var(--transition), transform var(--transition);
            @include flexCenter;

            &:hover {
                transform: translateY(-1px);
                box-shadow: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
            }

            &:active {
                transform: translateY(2px);
                box-shadow: none;
            }

            svg {
                @include svgStyle($color: var(--c-secondary));
            }
        }

        .user-block {
            margin-left: 4px;
            @include flex($alignItems: center, $gap: 8px);

            .avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid rgb(240, 241, 246);
                object-fit: cover;
                cursor: pointer;
                transition: box-shadow var(--transition), transform var(--transition);

                &:hover {
                    transform: translateY(-1px);
                    box-shadow: rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;
                }

                &:active {
                    transform: translateY(2px);
                    box-shadow: none;
                }
            }

            .info {
                @include flex($direction: column);

                span {
                    font-size: 14px;
                    max-width: 160px;
                    @include maxRow($rowCount: 1);
                }

                .username {
                    font-weight: 500;
                }
            }
        }
    }

    .mobile-menu-btn {
        display: none;
        margin-left: auto;
        cursor: pointer;
        @include svgStyle($size: 32px);

        @media screen and (max-width: 722px) {
            display: block;
        }
    }
}
</style>