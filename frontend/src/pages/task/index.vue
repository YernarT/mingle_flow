<template>
  <main class="task-page">
    <HeaderComp />

    <div class="itisit-container head">
      <div class="project">
        <Button data-icon @click="$router.back">
          <Icon name="material-symbols:arrow-left-alt-rounded" />
        </Button>
        <h1>{{ project?.name }}</h1>

        <a-button
          class="add-task-btn"
          type="primary"
          @click="taskDrawer.isOpen = true"
        >
          <Icon name="material-symbols:add-rounded" />
          Жаңа тапсырма
        </a-button>
      </div>

      <TaskDrawer
        :isOpen="taskDrawer.isOpen"
        :task="taskDrawer.task"
        @close="taskDrawer.isOpen = false"
        @create="handleCreateTask"
      />

      <div class="filter-block">
        <span class="hint">Сүзгілер: </span>
        <ul class="filters">
          <Button
            v-for="filter in TASK.filter"
            :key="filter.value"
            :type="filterKey === filter.value ? 'primary' : 'text'"
            @click="filterKey = filter.value"
          >
            {{ filter.label }}
          </Button>
        </ul>
      </div>
    </div>

    <ClientOnly>
      <TaskKanban
        class="itisit-container"
        :taskList="taskList"
        @changeState="(task, status) => updateTask(task.id, { status })"
      />
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
// Types
import type { I_Project } from "~/types/project";
import type { T_Filter, I_Task } from "~/types/task";

// Vue
import { ref, onBeforeMount } from "vue";
// Router
import { useRoute } from "vue-router";
// Hooks
import { useRequest } from "vue-hooks-plus";
// API
import { API_FetchProject } from "@/service/api/project-api";
import { API_FetchTaskList, API_UpdateTask } from "@/service/api/task-api";
// Component
import { Button, message } from "ant-design-vue";
import HeaderComp from "@/components/common/HeaderComp.vue";
import TaskKanban from "@/components/business/TaskKanban.vue";
import TaskDrawer from "@/components/business/TaskDrawer.vue";
// Constants
import { TASK } from "@/constants/task";
// Utils
import _ from "lodash";

defineOptions({ name: "TaskPage" });

const route = useRoute();
const project = ref<I_Project>();
const filterKey = ref<T_Filter>("all");
const taskList = ref<{
  backlog: I_Task[];
  analyze: I_Task[];
  develop: I_Task[];
  test: I_Task[];
  finish: I_Task[];
}>({
  backlog: [],
  analyze: [],
  develop: [],
  test: [],
  finish: [],
});

const taskDrawer = ref<{ isOpen: boolean; task: I_Task | null }>({
  isOpen: false,
  task: null,
});

const { runAsync: fetchProject, loading: loaingFetchProject } = useRequest(
  API_FetchProject,
  { manual: true }
);

const { runAsync: fetchTaskList, loading: loadingFetchTaskList } = useRequest(
  API_FetchTaskList,
  { manual: true }
);

const { run: updateTask, loading: loadingUpdateTask } = useRequest(
  API_UpdateTask,
  {
    manual: true,
    onSuccess(response) {
      message.success("Өзгеріс сақталды");
      taskDrawer.value.isOpen = false;
    },
  }
);

onBeforeMount(async () => {
  const projectId = route.query.project;
  // not providing project id || project id is not number
  if (!projectId || !/^\d+$/.test(projectId.toString())) {
    // @todo: 404页面
    return;
  }

  project.value = (await fetchProject(Number(projectId))).data;
  taskList.value = (await fetchTaskList(project.value.id)).data;
});

const handleCreateTask = (task: I_Task) => {
  // @ts-ignore
  const statusKey = _.findKey(
    TASK.status,
    (statusValue) => statusValue === task.status
  );
  // @ts-ignore
  taskList.value[statusKey].unshift(task);
  taskDrawer.value.isOpen = false;
};
</script>

<style scoped lang="scss">
@import "@/assets/style/mixins.scss";

.task-page {
  min-height: 100dvh;
  .head {
    margin-top: 32px;
    margin-bottom: 32px;
    @include flex($direction: column);

    .project {
      width: 100%;
      margin-bottom: 16px;
      @include flex($alignItems: center, $gap: 16px);

      h1 {
        font-size: 24px;
        font-weight: 500;
      }

      .add-task-btn {
        margin-left: auto;
        height: 44px;
        border-radius: 26px;
      }
    }

    .filter-block {
      @include flex($alignItems: center, $gap: 8px);
      .filters {
        @include flex($alignItems: center, $gap: 4px);

        .ant-btn {
          padding: 2px 8px;
        }
      }
    }
  }
}
</style>
