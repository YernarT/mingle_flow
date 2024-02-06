<template>
    <div ref="$selectRef" class="select-wrap">
        <div class="select">
            <input v-model="state.searchString" type="text" placeholder="Алушы таңдаңыз"
                @focus="state.optionsVisible = true" />
            <Icon name="ic:round-search" />
        </div>

        <div class="options" :class="{ 'options--open': state.optionsVisible }">
            <div v-for="option in state.options" :key="option.id" class="option" @click="handleSelectOption(option)">
                {{ option.fullname }}
            </div>

            <div v-if="state.options.length === 0" class="empty">
                <Icon name="material-symbols:frame-person" />
                <span>Іздеген қолданушы табылмады</span>
            </div>

            <div v-if="loading" class="empty">
                <Icon name="line-md:loading-loop" />
                <span>Жүктелуде...</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Types
import type { I_User } from '~/types/user';
import type { PropType } from 'vue';

// API
import { API_GetUserList } from '~/service/api/user-api';
// Hooks
import useRequest from 'vue-hooks-plus/es/useRequest';
import { onClickOutside } from '@vueuse/core'

defineComponent({ name: 'SelectUser' });

const props = defineProps({
    initial: {
        type: Object as PropType<I_User | null>,
        default: null,
    }
});

const $emit = defineEmits<{
    (event: 'select', user: I_User | null): void
}>();

const state = reactive<{
    userList: I_User[],
    options: I_User[],
    selectedUser: I_User | null,
    optionsVisible: boolean,
    searchString: string
}>({
    userList: [],
    options: [],
    selectedUser: props.initial,
    optionsVisible: false,
    searchString: props.initial?.fullname ?? ''
});

const { loading, run: fetchUserList } = useRequest(API_GetUserList, {
    onSuccess({ data }) {
        state.userList = data;
        state.options = data;
    }
});

const $selectRef = ref<HTMLDivElement>();

onClickOutside($selectRef, () => {
    state.optionsVisible = false;
});

// 处理搜索文本
watch(() => state.searchString, (val: string) => {
    if (val === '') {
        fetchUserList();
        $emit('select', null);
        return;
    };

    if (state.selectedUser && state.selectedUser.fullname === val) {
        $emit('select', toRaw(state.selectedUser));
    } else {
        $emit('select', null);
    }

    return state.options = state.userList.filter(user => user.fullname.includes(val));
});


// 选中 option 其中一项
const handleSelectOption = (option: I_User) => {
    state.selectedUser = option;
    state.optionsVisible = false;
    state.searchString = option.fullname;
};

</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.select-wrap {
    position: relative;
    border-radius: var(--border-radius);

    .select {
        width: 100%;
        height: 100%;
        outline: none;
        border-radius: inherit;
        border: 1px solid #d9d9d9;
        transition: border-color var(--transition);
        position: relative;

        &:hover {
            border-color: var(--c-primary);
        }

        input {
            width: 100%;
            height: 100%;
            padding: 4px 40px 4px 12px;
            outline: none;
            border: none;
            border-radius: inherit;
            border-right: none;
            transition: box-shadow var(--transition);

            &:focus {
                box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
            }
        }

        .itisit-icon {
            transform: translate(-100%, -50%);
            @include positioned($top: 50%, $left: calc(100% - 8px));
        }
    }

    .options {
        width: 100%;
        max-height: 260px;
        padding: 8px 0;
        overflow: hidden auto;
        border-radius: var(--border-radius);
        background-color: #fff;
        box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
        opacity: 0;
        transform-origin: bottom;
        transform: translateY(calc(-100% - 12px)) scaleY(0);
        transition: transform var(--transition), opacity var(--transition);
        @include positioned($top: 0, $left: 0);
        @include flex($direction: column);
        @include useScroll;

        &--open {
            opacity: 1;
            transform: translateY(calc(-100% - 12px)) scaleY(1);
        }

        .option {
            width: 100%;
            padding: 6px 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: background-color var(--transition);
            cursor: pointer;

            &:hover {
                background-color: #f2f2f2;
            }
        }
    }

    .empty {
        width: 100%;
        height: 120px;
        padding: 12px;
        @include flexCenter($direction: column, $gap: 8px);

        svg {
            @include svgStyle($size: 40px);
        }

        span {
            text-align: center;
        }
    }
}
</style>
