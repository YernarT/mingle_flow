<template>
  <div class="task-kanban">
    <div class="list-wrap">
      <div class="head">Архив ({{ taskList.backlog.length }})</div>
      <div class="list">
        <TaskCard
          v-for="task in taskList.backlog"
          :key="task.id"
          :task="task"
        />
      </div>
    </div>
    <div class="list-wrap">
      <div class="head">Талдау ({{ taskList.analyze.length }})</div>
      <div class="list">
        <TaskCard
          v-for="task in taskList.analyze"
          :key="task.id"
          :task="task"
        />
      </div>
    </div>
    <div class="list-wrap">
      <div class="head">Әзірлеу ({{ taskList.develop.length }})</div>
      <div class="list">
        <TaskCard
          v-for="task in taskList.develop"
          :key="task.id"
          :task="task"
        />
      </div>
    </div>
    <div class="list-wrap">
      <div class="head">Сынақ ({{ taskList.test.length }})</div>
      <div class="list">
        <TaskCard v-for="task in taskList.test" :key="task.id" :task="task" />
      </div>
    </div>
    <div class="list-wrap">
      <div class="head">Аяқталған ({{ taskList.finish.length }})</div>
      <div class="list">
        <TaskCard v-for="task in taskList.finish" :key="task.id" :task="task" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import type { I_Task } from "@/types/task";

// Components
import TaskCard from "@/components/business/TaskCard/index.vue";

defineOptions({ name: "TaskKanban" });

const props = defineProps<{
  taskList: {
    backlog: I_Task[];
    analyze: I_Task[];
    develop: I_Task[];
    test: I_Task[];
    finish: I_Task[];
  };
}>();
</script>

<style scoped lang="scss">
@import "~/assets/style/mixins.scss";

.task-kanban {
  @include flex($gap: 8px);

  .list-wrap {
    flex: 1 1 100%;
    @include flex($direction: column, $gap: 8px);

    .head {
      font-size: 18px;
      margin-bottom: 8px;
    }

    .list {
      width: 100%;
      @include flex($direction: column, $gap: 8px);
    }
  }
}
</style>
