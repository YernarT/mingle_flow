<template>
    <main class="user-page">
        <div class="head">
            <a-button @click="$router.go(-1)">
                <Icon name="material-symbols:arrow-left-alt-rounded" />
            </a-button>

            <h3 class="title">Қолданушылар</h3>
        </div>

        <div class="content">
            <div class="head">
                <h4 class="title">Деректер қорында сақталған <strong>{{ userList.length }}</strong> жазба</h4>

                <div class="actions">
                    <a-button @click="addUserModalVisible = true">
                        Қосу
                        <Icon name="material-symbols:add-circle" />
                    </a-button>
                    <a-button @click="getUserList">
                        Жаңарту
                        <Icon name="material-symbols:sync-outline" />
                    </a-button>
                </div>
            </div>

            <UserTable :dataSource="userList" :loading="getUserListLoading" @delete="handleDeleteUser" />
            <AddUserModal :is-open="addUserModalVisible" @add="handleAddUser" @cancel="addUserModalVisible = false" />
        </div>
    </main>
</template>

<script setup lang="ts">
// Types
import type { I_User } from "~/types/user";

// Store
import { useUser } from "~/stores/user";
// Hooks
import { useRequest } from 'vue-hooks-plus';
// API
import { API_GetUserList, API_DeleteUser } from '~/service/api/user-api';
// Antd Component
import { message as AntdMessage } from 'ant-design-vue';
// Component
import UserTable from "~/components/database_page/UserTable.vue";
import AddUserModal from "~/components/database_page/AddUserModal.vue";
import UpdateUserModal from "~/components/database_page/UpdateCargoModal.vue";

const userStore = useUser();
const userList = ref<(I_User & { checked: boolean })[]>([]);
const addUserModalVisible = ref(false);
const updateUserModalVisible = ref(false);
const userToBeUpdated = ref<I_User[]>([]);

const { run: getUserList, loading: getUserListLoading } = useRequest(API_GetUserList, {
    onSuccess({ data }) {
        userList.value = data.map(user => ({ ...user, checked: false }));
    }
});

const { run: deleteUser, loading: deleteUserLoading } = useRequest(API_DeleteUser, {
    manual: true,
    onSuccess(_, [deletedUserId]) {
        AntdMessage.success('Сәтті жойылды');
        userList.value = userList.value.filter(user => user.id !== deletedUserId);
    }
});

// 新增用户
const handleAddUser = (addedUser: I_User) => {
    userList.value.push({ ...addedUser, checked: false });
}

// 删除用户
const handleDeleteUser = (deletedUser: I_User) => {
    deleteUser(deletedUser.id);
}
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.user-page {
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
            @include flex($justifyContent: space-between);

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
}
</style>
