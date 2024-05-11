<template>
  <a-drawer
    class="task-drawer"
    title="Тапсырма"
    width="50dvw"
    placement="left"
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

      <a-row>
        <a-col span="11">
          <a-form-item label="Басымдық" name="priority">
            <a-select
              v-model:value="formState.priority"
              showArrow
              :options="TASK.priorityOptions"
            />
          </a-form-item>
        </a-col>

        <a-col span="2" />

        <a-col span="11">
          <a-form-item label="Статус" name="status">
            <a-select
              v-model:value="formState.status"
              showArrow
              :options="TASK.statusOptions"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col span="11">
          <a-form-item
            label="Жоба"
            name="project"
            :rules="[{ required: true, message: 'Жоба міндетті' }]"
          >
            <a-select
              v-model:value="formState.project"
              showArrow
              :options="contributorList"
              placeholder="Жоба іздеу"
            >
              <template #notFoundContent>
                <a-empty description="Жоба табылмады, басқаша іздеп көріңіз" />
              </template>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col span="2" />

        <a-col span="11">
          <a-form-item label="Орындаушы" name="worker">
            <a-select
              v-model:value="formState.worker"
              showArrow
              :options="contributorList"
              placeholder="Пайдаланушы іздеу"
            >
              <template #notFoundContent>
                <a-empty
                  description="Пайдаланушы табылмады, басқаша іздеп көріңіз"
                />
              </template>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        label="Тапсырма уақыты"
        name="dataRange"
        :rules="[
          { required: true, message: 'Уақыт міндетті' },
          { validator: checkDataRange },
        ]"
      >
        <a-range-picker v-model:value="formState.dataRange" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" htmlType="submit" :loading="loadingCreateTask">
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
import type { I_Task, I_Task_Create } from "~/types/task";
// Vue
import { computed, onMounted, watch } from "vue";
// Store
import { useUserStore } from "@/stores/user";
// Hooks
import { useRequest } from "vue-hooks-plus";
// API
import { API_FectchUserList } from "@/service/api/user-api";
import { API_CreateTask } from "@/service/api/task-api";
import { message } from "ant-design-vue";
// Constants
import { PROJECT } from "~/constants/project";
import { TASK } from "~/constants/task";
import { values } from "lodash";

defineOptions({ name: "TaskDrawer" });

const emit = defineEmits<{
  (event: "close"): void;
  (event: "create", task: I_Task): void;
}>();

const props = defineProps<{
  isOpen: boolean;
  task: I_Task | null;
}>();

const userStore = useUserStore();
const contributorList = ref<I_User[]>([]);
const formState = ref<I_Task_Create>({
  name: "",
  description: "",
  status: TASK.status.backlog,
  priority: TASK.priority.low,
  startTime: null,
  dueTime: null,
  dataRange: [null, null],
  tags: [],
  project: null,
  worker: null,
});

const isEdit = computed(() => props.task !== null);

watch(
  () => props.task,
  (task) => {
    if (task === null) return;
    // @ts-ignore
    formState.value = task;
  }
);

const checkDataRange = async (_: any, value: []) => {
  if (value.some((date) => date === null)) {
    return Promise.reject("Уақыт міндетті");
  }
  return Promise.resolve();
};

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
  onError(error) {
    message.error(error.message);
  },
});

const { run: createTask, loading: loadingCreateTask } = useRequest(
  API_CreateTask,
  {
    manual: true,
    onSuccess(response) {
      message.success("Сәтті құрылды");
      emit("create", response.data);
    },
  }
);

const onFinish = () => {
  const payload = JSON.parse(JSON.stringify(formState.value));
  payload.startTime = payload.dataRange[0];
  payload.dueTime = payload.dataRange[1];

  if (isEdit.value) {
    return;
  }

  payload.tags = payload.tags.join(",");
  createTask({ ...payload, creator: userStore.id });
};
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.task-drawer {
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
