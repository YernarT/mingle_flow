<template>
  <main class="task-page">
    <HeaderComp />

    <div class="itisit-container head">
      <div class="project">
        <Button data-icon @click="$router.back">
          <Icon name="material-symbols:arrow-left-alt-rounded" />
        </Button>
        <h1>{{ project?.name }}</h1>

        <a-button class="add-task-btn" type="primary">
          <Icon name="material-symbols:add-rounded" />
          Жаңа тапсырма
        </a-button>
      </div>

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

    <TaskKanban class="itisit-container" :taskList="taskList" />
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
import { API_FetchTaskList } from "@/service/api/task-api";
// Component
import { Button } from "ant-design-vue";
import HeaderComp from "@/components/common/HeaderComp.vue";
import TaskKanban from "@/components/business/TaskKanban.vue";
// Constants
import { TASK } from "@/constants/task";

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

const { runAsync: fetchProject, loading: loaingFetchProject } = useRequest(
  API_FetchProject,
  { manual: true }
);

const { runAsync: fetchTaskList, loading: loadingFetchTaskList } = useRequest(
  API_FetchTaskList,
  { manual: true }
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
