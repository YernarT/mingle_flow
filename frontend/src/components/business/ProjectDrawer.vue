<template>
  <a-drawer
    class="project-drawer"
    title="Жоба"
    width="50dvw"
    placement="right"
    :open="props.isOpen"
    @close="$emit('close')"
  >
    <a-form
      :model="formState"
      autocomplete="off"
      layout="vertical"
      @finish="onFinish"
    >
      <a-form-item
        label="Атауы"
        name="name"
        :rules="[{ required: true, message: 'Атауы міндетті' }]"
      >
        <a-input v-model:value="formState.name" />
      </a-form-item>

      <a-form-item label="Сипаттама" name="description">
        <a-textarea
          v-model:value="formState.description"
          showCount
          :maxLength="500"
          :autoSize="{ minRows: 4, maxRows: 6 }"
        />
      </a-form-item>

      <a-form-item label="Статус" name="status">
        <a-select
          v-model:value="formState.status"
          showArrow
          :virtual="false"
          :options="PROJECT.statuses"
        />
      </a-form-item>

      <a-form-item label="Мүшелер" name="contributorList">
        <a-avatar-group :max-count="6">
          <a-avatar
            v-for="contributor in formState.contributorList"
            :key="contributor.id"
            :src="contributor.avatar"
          >
            {{ contributor.fullname.slice(0, 2) }}
          </a-avatar>
        </a-avatar-group>

        <a-select
          :value="formState.contributorList"
          showArrow
          :virtual="false"
          :max-tag-count="3"
          :options="contributorList"
          mode="multiple"
          placeholder="Мүшелер іздеу"
          @select="handleSelectUser"
          @deselect="handleDeselectUser"
        >
          <template #notFoundContent>
            <a-empty description="Мүшелер табылмады, басқаша іздеп көріңіз" />
          </template>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          htmlType="submit"
          :loading="loadingCreateProject"
        >
          {{ isEdit ? "Сақтау" : "Құру" }}
        </a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script setup lang="ts">
// Types
import type { I_User } from "~/types/user";
import type { I_Project, I_ProjectContributor } from "~/types/project";
// Vue
import { reactive, computed, onMounted, watch } from "vue";
// Store
import { useUserStore } from "@/stores/user";
// Hooks
import { useRequest } from "vue-hooks-plus";
// API
import { API_FectchUserList } from "@/service/api/user-api";
import { API_CreateProject } from "@/service/api/project-api";
import { message } from "ant-design-vue";
// Constants
import { PROJECT } from "~/constants/project";

defineOptions({ name: "ProjectDrawer" });

const emit = defineEmits<{
  (event: "close"): void;
  (event: "create", project: I_Project): void;
}>();

const props = defineProps<{
  isOpen: boolean;
  project: I_Project | null;
}>();

const userStore = useUserStore();
const contributorList = ref<I_User[]>([]);
const defaultAvatar = "/image/unauthorized_user_avatar.png";
const formState = reactive({
  name: "",
  description: "",
  status: 0,
  contributorList: [] as I_ProjectContributor[],
});

const isEdit = computed(() => props.project !== null);

onMounted(() => {
  if (!isEdit.value && formState.contributorList.length === 0) {
    // @ts-ignore
    formState.contributorList.push(userStore.$state);
  }

  // @ts-ignore
  formState.contributorList = formState.contributorList.map((contributor) => {
    // @ts-ignore
    contributor.label = contributor.fullname;
    // @ts-ignore
    contributor.value = contributor.id;
    return contributor;
  });
});

watch(
  () => props.project,
  (project) => {
    if (project === null) return;

    formState.name = project.name;
    formState.description = project.description;
    formState.status = project.status;
    // @ts-ignore
    formState.contributorList = project.contributorList.map((contributor) => {
      // @ts-ignore
      contributor.lable = contributor.fullname;
      // @ts-ignore
      contributor.value = contributor.id;

      return contributor;
    });
  }
);

useRequest(API_FectchUserList, {
  onSuccess(response) {
    // @ts-ignore
    contributorList.value = response.data.map((contributor) => {
      // @ts-ignore
      contributor.label = contributor.fullname;
      // @ts-ignore
      contributor.value = contributor.id;

      return contributor;
    });
  },
});

const { run: createProject, loading: loadingCreateProject } = useRequest(
  API_CreateProject,
  {
    manual: true,
    onSuccess(response) {
      message.success("Сәтті құрылды");
      emit("create", response.data);
    },
  }
);

const handleSelectUser = (contributorId: number) => {
  const isAlreadyExist = formState.contributorList.find(
    (contributor) => contributor.id === contributorId
  );

  if (isAlreadyExist) return;

  const contributor = contributorList.value.find(
    (contributor) => contributor.id === contributorId
  );
  formState.contributorList.push({
    ...contributor,
    // @ts-ignore
    label: contributor!.fullname,
    value: contributor!.id,
  });
};

const handleDeselectUser = (contributorId: number) => {
  if (!isEdit.value && userStore.id === contributorId) return;
  // @ts-ignore
  if (isEdit.value && formState!.creator!.id === contributorId) return;

  formState.contributorList = formState.contributorList.filter(
    (contributor) => contributor.id === contributorId
  );
};

const onFinish = () => {
  if (isEdit.value) {
    return;
  }

  createProject({ ...formState, creator: userStore.id });
};
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.project-drawer {
  .ant-form-item:last-child {
    margin-top: 40px;

    :deep(.ant-form-item-control-input-content) {
      @include flex($justifyContent: flex-end);

      .ant-btn {
        height: 40px;
      }
    }
  }
}
</style>
